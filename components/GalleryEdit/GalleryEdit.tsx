import React, { useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

import useFirebase from '../../hooks/useFirebase';
import Box from '../Box';
import GalleryEditPhotos, { PhotoFile } from './GalleryEditPhotos';

const GalleryEdit: React.FC = () => {
  const firebase = useFirebase();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [editDescription, setEditDescription] = useState(false);

  const formValid = title && description && photos.length > 0;

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
