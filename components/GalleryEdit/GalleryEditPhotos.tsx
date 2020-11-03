import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Card, Spinner } from 'reactstrap';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { layout } from 'styled-system';
import uniqid from 'uniqid';
import config from 'config';
import { DndProvider, DragElementWrapper } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Grid, GridItem } from '../Grid';
import { GridItemProps } from '../Grid/Grid';
import Box from '../Box';
import useAdmin from '../../hooks/useAdmin';
import { usePhotoDrag, usePhotoDrop } from '../../hooks/usePhotoDragAndDrop';

export interface PhotoFile {
  id: string;
  url: string;
  filename: string;
  fileId: string | null;
  loading: boolean;
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

const PhotoItemDropArea = styled.div<{ active: boolean; right?: boolean }>`
  position: absolute;
  top: 0;
  ${({ right }) => (right ? 'right: 0' : 'left: 0')};
  width: 50%;
  height: 100%;
  z-index: 10;
  pointer-events: ${({ active }) => (active ? 'auto' : 'none')};
`;

const StyledPhotoItem = styled.div<{
  url: string;
  loading?: boolean;
  placeholder?: boolean;
}>`
  width: 100%;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(${({ url }) => url}) center no-repeat;
  background-size: contain;
  cursor: ${({ placeholder }) => (placeholder ? 'default' : 'grab')};
  opacity: ${({ loading, placeholder }) =>
    // eslint-disable-next-line no-nested-ternary
    loading ? 0.4 : placeholder ? 0.2 : 1};

  button {
    outline: none;
  }

  .photo-delete-button-wrapper button {
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  .photo-delete-button-wrapper button:hover {
    opacity: 1;
  }
`;

const PhotoItem = React.forwardRef<
  DragElementWrapper<any>,
  {
    url: string;
    loading?: boolean;
    placeholder?: boolean;
    dragging?: boolean;
    onDelete?: () => void;
    onDisableDragChange?: (disable: boolean) => void;
  }
>(
  (
    { url, loading, placeholder, dragging, onDisableDragChange, onDelete },
    ref
  ) => {
    const [showActions, setShowActions] = useState(false);

    const disableDragHandlers = {
      onMouseEnter: () => {
        if (onDisableDragChange) onDisableDragChange(true);
      },
      onMouseLeave: () => {
        if (onDisableDragChange) onDisableDragChange(false);
      },
    };

    return (
      <StyledPhotoItem
        ref={ref as any}
        url={url}
        loading={loading}
        placeholder={placeholder as any}
        onMouseLeave={() => setShowActions(false)}
      >
        {loading && <Spinner />}
        {!placeholder && !loading && !dragging && !showActions && (
          <span className="photo-delete-button-wrapper">
            <Button
              variant="contained"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => setShowActions(true)}
              {...disableDragHandlers}
            >
              Löschen
            </Button>
          </span>
        )}
        {!placeholder && showActions && (
          <Box display="flex" flexDirection="column">
            <Box display="flex" flexDirection="column" mb={2}>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<CheckIcon />}
                onClick={() => {
                  setShowActions(false);
                  if (onDelete) onDelete();
                }}
                {...disableDragHandlers}
              >
                Ja
              </Button>
            </Box>
            <Button
              variant="contained"
              size="small"
              startIcon={<ClearIcon />}
              onClick={() => setShowActions(false)}
              {...disableDragHandlers}
            >
              Nein
            </Button>
          </Box>
        )}
      </StyledPhotoItem>
    );
  }
);

const PhotoGridDragItem: React.FC<
  PhotoFile & {
    onDropBefore: (id: string) => void;
    onDropAfter: (id: string) => void;
    onDelete: () => void;
  }
> = ({ id, url, loading, onDropBefore, onDropAfter, onDelete }) => {
  const [disableDrag, setDisableDrag] = useState(false);
  const [{ isDragging }, drag] = usePhotoDrag({
    id,
    url,
    disable: disableDrag,
  });

  const [
    { isOver: isOverBefore, url: urlBefore, dropActive },
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
        <PhotoItemDropArea active={dropActive} ref={dropBefore} />
        {isOverBefore && urlBefore && (
          <Box pr={4} width={1}>
            <PhotoItem placeholder url={urlBefore} />
          </Box>
        )}
        <PhotoItem
          ref={drag as any}
          url={url}
          loading={loading}
          dragging={isDragging}
          onDelete={onDelete}
          onDisableDragChange={setDisableDrag}
        />
        {isOverAfter && urlAfter && (
          <Box pl={4} width={1}>
            <PhotoItem placeholder url={urlAfter} />
          </Box>
        )}
        <PhotoItemDropArea active={dropActive} right ref={dropAfter} />
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const photosRef = useRef<PhotoFile[]>(photos);
  photosRef.current = photos;

  const handlePhotosAdd = (files: FileList) => {
    const newPhotos = Array.from(files).map((file) => {
      return {
        id: uniqid(),
        url: URL.createObjectURL(file),
        filename: file.name,
        fileId: null,
        loading: false,
        uploaded: false,
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

  const handlePhotoDelete = async (photo: PhotoFile) => {
    onChange(
      photos.map((p) =>
        p.id === photo.id
          ? {
              ...p,
              loading: true,
            }
          : p
      )
    );

    try {
      const res = await fetch(`/api/photo?ids=${photo.fileId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (res.status !== 200) throw new Error();

      onChange(photos.filter((p) => p.id !== photo.id));
    } catch (err) {
      onChange(
        photos.map((p) =>
          p.id === photo.id
            ? {
                ...p,
                loading: false,
              }
            : p
        )
      );
    }
  };

  const uploadPhoto = useCallback(
    async (photo: PhotoFile) => {
      try {
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

        const res = await fetch('/api/photo', {
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

        if (res.status !== 200) throw new Error();

        const { fileId } = await (res.json() as Promise<{ fileId: string }>);

        const url = `${imagekitUrl}/${fileName}?tr=${imagekitThumbTransform}`;

        // await new Promise((resolve) =>
        //   setTimeout(resolve, Math.random() * 1000 + 500)
        // );

        // const { url, fileId } = photo;

        onChange(
          photosRef.current.map((p) => {
            if (p.url !== photo.url) return p;

            return {
              ...photo,
              url,
              filename: fileName,
              fileId,
              loading: false,
              uploaded: true,
            };
          })
        );
      } catch (err) {
        onChange(photosRef.current.filter((p) => p.id !== photo.id));
      }
    },
    [onChange, userToken]
  );

  useEffect(() => {
    const newPhotos = photos.filter(
      (photo) => !photo.uploaded && !photo.loading
    );

    if (newPhotos.length) {
      newPhotos.forEach(uploadPhoto);

      const updatedPhotos = photos.map((photo) =>
        newPhotos.includes(photo)
          ? {
              ...photo,
              loading: !photo.uploaded,
            }
          : photo
      );

      onChange(updatedPhotos);
    }
  }, [photos, uploadPhoto, onChange]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        my={3}
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
              onDelete={() => handlePhotoDelete(photo)}
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
                  ref={fileInputRef}
                  onDrop={(e) => {
                    e.stopPropagation();
                  }}
                  onChange={(e) => {
                    e.stopPropagation();
                    handlePhotosAdd(e.currentTarget.files || ([] as any));

                    if (fileInputRef.current) fileInputRef.current.value = '';
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
