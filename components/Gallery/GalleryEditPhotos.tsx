import React, { useCallback, useEffect, useRef } from 'react';
import { Card, Spinner } from 'reactstrap';
import styled from 'styled-components';
import AddIcon from '@material-ui/icons/Add';
import { layout } from 'styled-system';
import uniqid from 'uniqid';
import config from 'config';
import { DndProvider, DragElementWrapper, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Grid, GridItem } from '../Grid';
import { GridItemProps } from '../Grid/Grid';
import Box from '../Box';
import useAdmin from '../../hooks/useAdmin';

export interface PhotoFile {
  id: string;
  url: string;
  filename: string;
  uploading: boolean;
  uploaded: boolean;
}

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
  url,
}: {
  id: string;
  url: string;
}): [{ isDragging: boolean }, DragElementWrapper<any>] => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'photo', id, url },
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
  { isOver: boolean; enableDrop: boolean; url?: string },
  DragElementWrapper<any>
] => {
  const [{ isOver, enableDrop, url }, drop] = useDrop<
    { id: string; type: string },
    any,
    { isOver: boolean; enableDrop: boolean; url: string }
  >({
    accept: 'photo',
    drop: (item) => onDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      enableDrop: !!monitor.getItem() && monitor.getItem().id !== id,
      url: monitor.getItem()?.url || '',
    }),
  });

  return [
    {
      isOver,
      enableDrop,
      url,
    },
    drop,
  ];
};

const PhotoGridDragItem: React.FC<
  PhotoFile & {
    onDropBefore: (id: string) => void;
    onDropAfter: (id: string) => void;
  }
> = ({ id, url, uploading, onDropBefore, onDropAfter }) => {
  const [{ isDragging }, drag] = usePhotoDrag({ id, url });

  const [
    { isOver: isOverBefore, url: urlBefore, enableDrop },
    dropBefore,
  ] = usePhotoDrop({ id, onDrop: onDropBefore });
  const [{ isOver: isOverAfter, url: urlAfter }, dropAfter] = usePhotoDrop({
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
                backgroundImage: `url("${urlBefore}")`,
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
            backgroundImage: `url("${url}")`,
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
                backgroundImage: `url("${urlAfter}")`,
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

const GalleryEditPhotos: React.FC<{
  photos: PhotoFile[];
  onChange: (photos: PhotoFile[]) => void;
}> = ({ photos, onChange }) => {
  const { user } = useAdmin();
  const { token: userToken } = user || {};

  const photosRef = useRef<PhotoFile[]>(photos);
  photosRef.current = photos;

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

    onChange([...photos, ...newPhotos]);
  };

  const handlePhotoDrop = (dragId: string, dropId: string, after?: boolean) => {
    const nextPhotoIds = photos
      .filter((item) => item.id !== dragId)
      .reduce<string[]>((reduced, item) => {
        const insert = item.id === dropId ? [dragId, item.id] : [item.id];
        return [...reduced, ...(after ? insert.reverse() : insert)];
      }, [] as string[]);

    const nextPhotos = nextPhotoIds
      .map((itemId) => photos.find((item) => item.id === itemId))
      .filter((item) => !!item);

    onChange(nextPhotos as PhotoFile[]);
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

      onChange(
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

      onChange(updatedPhotos);
    }
  }, [photos, uploadPhoto, onChange]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        my={4}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();

          handlePhotosAdd(e.dataTransfer.files);
        }}
      >
        <Box mb={2}>Photos</Box>
        <Grid>
          {photos.map((photo) => (
            <PhotoGridDragItem
              {...photo}
              onDropBefore={(id) => handlePhotoDrop(id, photo.id)}
              onDropAfter={(id) => handlePhotoDrop(id, photo.id, true)}
              key={photo.id}
            />
          ))}
          <PhotoGridItem
            width={photos.length ? [1 / 2, 1 / 3, 1 / 3, 1 / 5] : 1}
          >
            <Card style={{ width: '100%' }}>
              <Box
                style={{
                  height: '180px',
                  width: '100%',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
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
                Photos hinzufügen
              </Box>
            </Card>
          </PhotoGridItem>
        </Grid>
      </Box>
    </DndProvider>
  );
};

export default GalleryEditPhotos;
