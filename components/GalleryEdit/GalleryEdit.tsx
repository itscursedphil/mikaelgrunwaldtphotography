import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
  Spinner,
} from 'reactstrap';
import styled from 'styled-components';
import AddIcon from '@material-ui/icons/Add';
import { layout } from 'styled-system';
import uniqid from 'uniqid';
import config from 'config';

import useFirebase from '../../hooks/useFirebase';
import { Grid, GridItem } from '../Grid';
import { GridItemProps } from '../Grid/Grid';
import Box from '../Box';
import useAdmin from '../../hooks/useAdmin';

const imagekitUrl = config.get<string>('public.imagekit.url');
const imagekitThumbTransform = config.get<string>(
  'public.imagekit.transforms.thumb'
);

const PhotoGridItem = styled(GridItem)<GridItemProps>`
  display: flex;
  ${() => layout({ mb: 4 })}
`;

const StyledPhotoUploadIcon = styled.span`
  display: block;
  width: 3rem;
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
`;

const PhotoUploadIcon = () => (
  <StyledPhotoUploadIcon>
    <AddIcon />
  </StyledPhotoUploadIcon>
);

const HiddenPhotoUploadInput = styled.input.attrs({
  type: 'file',
  multiple: true,
  accept: '.jpg,.jpeg',
})`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  opacity: 0;
  cursor: pointer;
`;

interface PhotoFile {
  id: string;
  url: string;
  filename: string;
  uploading: boolean;
  uploaded: boolean;
}

const GalleryEdit: React.FC = () => {
  const firebase = useFirebase();
  const { user } = useAdmin();

  const { token: userToken } = user || {};

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const photosRef = useRef<PhotoFile[]>(photos);

  photosRef.current = photos;

  const [editTitle, setEditTitle] = useState(false);
  const [editDescription, setEditDescription] = useState(false);

  const formValid = title && description;

  const handleSubmit = async () => {
    const slug = title.toLowerCase().replace(' ', '-');
    if (formValid) {
      const res = await firebase
        .firestore()
        .collection('projects')
        .add({
          title,
          slug,
          description,
          files: photos.map(({ filename }) => filename),
        });

      console.log(res);
    }
  };

  const uploadPhoto = useCallback(
    async (photo: PhotoFile) => {
      const img = new Image();
      const { width, height } = await new Promise((resolve) => {
        img.addEventListener('load', () =>
          resolve({ width: img.width, height: img.height })
        );
        img.src = photo.url;
      });
      const fileName = `${photo.id}-${width}x${height}.jpg`;
      const blob = await fetch(photo.url).then((res) => res.blob());
      const file = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result));
        reader.readAsDataURL(blob);
      });

      await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          file,
          fileName,
        }),
      });

      const url = `${imagekitUrl}/${fileName}?tr=${imagekitThumbTransform}`;

      setPhotos(
        photosRef.current.map((p) => {
          if (p.url !== photo.url) return p;

          return {
            ...photo,
            url,
            filename: fileName,
            uploading: false,
            uploaded: true,
          };
        })
      );
    },
    [userToken]
  );

  useEffect(() => {
    const newPhotos = photos.filter(
      (photo) => !photo.uploaded && !photo.uploading
    );

    if (newPhotos.length) {
      newPhotos.forEach(uploadPhoto);

      const updatedPhotos = photos.map((photo) => ({
        ...photo,
        uploading: !photo.uploaded,
      }));

      setPhotos(updatedPhotos);
    }
  }, [photos, uploadPhoto]);

  return (
    <Form
      style={{ width: '100%' }}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <FormGroup>
        <Label>Titel</Label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label>Beschreibung</Label>
        <Input
          type="textarea"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
      </FormGroup>
      <Box>
        <Grid>
          {photos.map((photo) => (
            <GridItem width={[1 / 2, 1 / 3, 1 / 3, 1 / 5]} key={photo.id}>
              <Box
                width={1}
                style={{
                  height: '180px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundImage: `url("${photo.url}")`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  opacity: photo.uploaded ? 1 : 0.4,
                }}
              >
                {!photo.uploaded && <Spinner />}
              </Box>
            </GridItem>
          ))}
          <PhotoGridItem
            width={photos.length ? [1 / 2, 1 / 3, 1 / 3, 1 / 5] : 1}
          >
            <Box
              style={{
                height: '180px',
                width: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <HiddenPhotoUploadInput
                onChange={(e) => {
                  const newPhotos = Array.from(e.currentTarget.files || []).map(
                    (file) => {
                      return {
                        id: uniqid(),
                        filename: file.name,
                        url: URL.createObjectURL(file),
                        uploaded: false,
                        uploading: false,
                      };
                    }
                  );

                  setPhotos([...newPhotos, ...photos]);
                }}
              />
              <PhotoUploadIcon />
              Photo hinzufügen
            </Box>
          </PhotoGridItem>
        </Grid>
      </Box>
      <Button type="submit" color="primary" disabled={!formValid}>
        Speichern
      </Button>
    </Form>
  );
};

export default GalleryEdit;
