import React, { useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

import useFirebase from '../../hooks/useFirebase';
import Box from '../Box';
import GalleryEditPhotos, { PhotoFile } from './GalleryEditPhotos';

const GalleryEdit: React.FC<{
  title?: string;
  description?: string;
  photos?: PhotoFile[];
}> = ({
  title: initialTitle = '',
  description: initialDescription = '',
  photos: initialPhotos = [],
}) => {
  const firebase = useFirebase();

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [photos, setPhotos] = useState<PhotoFile[]>(initialPhotos);
  const [editTitle, setEditTitle] = useState(!initialTitle);
  const [editDescription, setEditDescription] = useState(!initialDescription);
  const [hasChanges, setHasChanges] = useState(false);

  const formValid = title && description && photos.length > 0;
  const slug = title
    .toLowerCase()
    .split(' ')
    .join('-')
    .replace(/[^A-Za-z0-9-]/g, '');

  const handleSubmit = async () => {
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

  return (
    <Form
      style={{ width: '100%' }}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {editTitle && (
        <FormGroup>
          <Label>Titel</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
          {title && (
            <Box pt={1} opacity={0.4}>
              Slug: {slug}
            </Box>
          )}
        </FormGroup>
      )}
      {editDescription && (
        <FormGroup>
          <Label>Beschreibung</Label>
          <Input
            type="textarea"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
          />
        </FormGroup>
      )}
      <GalleryEditPhotos photos={photos} onChange={setPhotos} />
      <Box display="flex" justifyContent="flex-end">
        <Button type="submit" color="primary" disabled={!formValid}>
          Speichern
        </Button>
      </Box>
    </Form>
  );
};

export default GalleryEdit;
