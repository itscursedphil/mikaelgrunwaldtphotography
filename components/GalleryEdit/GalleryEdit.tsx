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
import styled, { css } from 'styled-components';
import AddIcon from '@material-ui/icons/Add';
import { layout } from 'styled-system';
import uniqid from 'uniqid';
import config from 'config';
import { DndProvider, DragElementWrapper, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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
  position: relative;
  ${() => layout({ mb: 4 })}
`;

const usePhotoDrag = ({
  id,
  src,
}: {
  id: string;
  src: string;
}): [{ isDragging: boolean }, DragElementWrapper<any>] => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'photo', id, src },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return [{ isDragging }, drag];
};

const usePhotoDrop = ({
  id,
  onDrop,
}: {
  id: string;
  onDrop: (id: string) => void;
}): [
  { isOver: boolean; enableDrop: boolean; src?: string },
  DragElementWrapper<any>
] => {
  const [{ isOver, enableDrop, src }, drop] = useDrop<
    { id: string; type: string },
    any,
    { isOver: boolean; enableDrop: boolean; src: string }
  >({
    accept: 'photo',
    drop: (item) => onDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      enableDrop: !!monitor.getItem() && monitor.getItem().id !== id,
      src: monitor.getItem()?.src || '',
    }),
  });

  return [
    {
      isOver,
      enableDrop,
      src,
    },
    drop,
  ];
};

const PhotoGridDragItem: React.FC<{
  id: string;
  src: string;
  uploading: boolean;
  onDropBefore: (id: string) => void;
  onDropAfter: (id: string) => void;
}> = ({ id, src, uploading, onDropBefore, onDropAfter }) => {
  const [{ isDragging }, drag] = usePhotoDrag({ id, src });

  const [
    { isOver: isOverBefore, src: srcBefore, enableDrop },
    dropBefore,
  ] = usePhotoDrop({ id, onDrop: onDropBefore });
  const [{ isOver: isOverAfter, src: srcAfter }, dropAfter] = usePhotoDrop({
    id,
    onDrop: onDropAfter,
  });

  return (
    <>
      <PhotoGridItem
        width={
          isOverBefore || isOverAfter
            ? [1, 2 / 3, 2 / 3, 2 / 5]
            : [1 / 2, 1 / 3, 1 / 3, 1 / 5]
        }
        style={
          isDragging
            ? {
                display: 'none',
              }
            : {}
        }
      >
        <Box
          ref={dropBefore}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            // eslint-disable-next-line no-nested-ternary
            width: '50%',
            height: '100%',
            zIndex: 10,
            pointerEvents: enableDrop ? 'auto' : 'none',
          }}
        />
        {isOverBefore && (
          <Box pr={4} width={1}>
            <Box
              style={{
                height: '180px',
                backgroundImage: `url("${srcBefore}")`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.4,
              }}
            />
          </Box>
        )}
        <Box
          ref={drag}
          width={1}
          style={{
            height: '180px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: `url("${src}")`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: uploading ? 0.4 : 1,
          }}
        >
          {uploading && <Spinner />}
        </Box>
        {isOverAfter && (
          <Box pl={4} width={1}>
            <Box
              style={{
                height: '180px',
                backgroundImage: `url("${srcAfter}")`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.4,
              }}
            />
          </Box>
        )}
        <Box
          ref={dropAfter}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            // eslint-disable-next-line no-nested-ternary
            width: '50%',
            height: '100%',
            zIndex: 10,
            pointerEvents: enableDrop ? 'auto' : 'none',
          }}
        />
      </PhotoGridItem>
    </>
  );
};

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
  const [hasChanges, setHasChanges] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [editDescription, setEditDescription] = useState(false);

  const photosRef = useRef<PhotoFile[]>(photos);
  photosRef.current = photos;

  const formValid = title && description && photos.length > 0;

  const handlePhotosAdd = (files: FileList) => {
    const newPhotos = Array.from(files).map((file) => {
      return {
        id: uniqid(),
        filename: file.name,
        url: URL.createObjectURL(file),
        uploaded: false,
        uploading: false,
      };
    });

    setPhotos([...photos, ...newPhotos]);
  };

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
          published: false,
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

      // await fetch('/api/upload', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${userToken}`,
      //   },
      //   body: JSON.stringify({
      //     file,
      //     fileName,
      //   }),
      // });

      // const url = `${imagekitUrl}/${fileName}?tr=${imagekitThumbTransform}`;

      const { url } = photo;

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
    <DndProvider backend={HTML5Backend}>
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
        <Box
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();

            handlePhotosAdd(e.dataTransfer.files);
          }}
        >
          <Grid>
            {photos.map((photo) => (
              <PhotoGridDragItem
                id={photo.id}
                src={photo.url}
                uploading={photo.uploading}
                key={photo.id}
                onDropBefore={(id) => {
                  const nextPhotoIds = photos
                    .filter((item) => item.id !== id)
                    .reduce<string[]>(
                      (reduced, item) => [
                        ...reduced,
                        ...(item.id === photo.id ? [id, item.id] : [item.id]),
                      ],
                      [] as string[]
                    );

                  const nextPhotos = nextPhotoIds
                    .map((itemId) => photos.find((item) => item.id === itemId))
                    .filter((item) => !!item);

                  setPhotos(nextPhotos as PhotoFile[]);
                }}
                onDropAfter={(id) => {
                  const nextPhotoIds = photos
                    .filter((item) => item.id !== id)
                    .reduce<string[]>(
                      (reduced, item) => [
                        ...reduced,
                        ...(item.id === photo.id ? [item.id, id] : [item.id]),
                      ],
                      [] as string[]
                    );

                  const nextPhotos = nextPhotoIds
                    .map((itemId) => photos.find((item) => item.id === itemId))
                    .filter((item) => !!item);

                  setPhotos(nextPhotos as PhotoFile[]);
                }}
              />
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
                  onDrop={(e) => {
                    e.stopPropagation();
                  }}
                  onChange={(e) => {
                    e.stopPropagation();

                    handlePhotosAdd(e.currentTarget.files || ([] as any));
                  }}
                />
                <PhotoUploadIcon />
                Photo hinzufügen
              </Box>
            </PhotoGridItem>
          </Grid>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Button type="submit" color="primary" disabled={!formValid}>
            Speichern
          </Button>
        </Box>
      </Form>
    </DndProvider>
  );
};

export default GalleryEdit;
