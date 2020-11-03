import fetch from 'node-fetch';
import config from 'config';
import atob from 'atob';
import btoa from 'btoa';
import FormData from 'form-data';
import { NextApiRequest, NextApiResponse } from 'next';

import firebase from '../../lib/firebase';

const firebaseAuthConfig = config.get<string>('public.firebase.auth');
const parsedFirebaseConfig = JSON.parse(atob(firebaseAuthConfig));

const imagekitKey = config.get<string>('private.imagekit.key');

if (!firebase.apps.length) {
  firebase.initializeApp(parsedFirebaseConfig);
}

const authorizeRequest = async (req: NextApiRequest): Promise<boolean> => {
  try {
    const auth = req.headers.authorization
      ? req.headers.authorization.replace('Bearer ', '')
      : '';

    if (!auth) throw new Error();

    const token = JSON.parse(atob(auth));
    const credential = firebase.auth.AuthCredential.fromJSON(token);

    if (!credential) throw new Error();

    await firebase.auth().signInWithCredential(credential);

    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return false;
  }
};

const handlePhotoAddRequest = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const authorized = await authorizeRequest(req);

  if (!authorized) {
    res.statusCode = 401;
    res.end();

    return;
  }

  try {
    const formData = new FormData();
    formData.append('useUniqueFileName', 'false');

    Object.keys(req.body).forEach((key) => formData.append(key, req.body[key]));

    const uploadRes = await fetch(
      'https://upload.imagekit.io/api/v1/files/upload',
      {
        method: 'POST',
        headers: {
          ...formData.getHeaders(),
          Authorization: `Basic ${btoa(`${imagekitKey}:`)}`,
        },
        body: formData,
      }
    );

    if (uploadRes.status !== 200) throw new Error();

    const { fileId } = await (uploadRes.json() as Promise<{ fileId: string }>);

    res.statusCode = 200;
    res.json({ fileId });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    res.statusCode = 500;
    res.end();
  }
};

const handlePhotoDeleteRequest = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const authorized = await authorizeRequest(req);

  if (!authorized) {
    res.statusCode = 401;
    res.end();

    return;
  }

  try {
    const { ids } = req.query as { ids: string };

    const deleteRes = await fetch(
      'https://api.imagekit.io/v1/files/batch/deleteByFileIds',
      {
        method: 'POST',
        headers: {
          // ...formData.getHeaders(),
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${imagekitKey}:`)}`,
        },
        body: JSON.stringify({
          fileIds: [ids],
        }),
      }
    );

    if (deleteRes.status !== 200) throw new Error();

    res.statusCode = 200;
    res.end();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    res.statusCode = 500;
    res.end();
  }
};

const photoApiRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const method = req.method?.toLowerCase();

  switch (method) {
    case 'post':
      await handlePhotoAddRequest(req, res);
      break;
    case 'delete':
      await handlePhotoDeleteRequest(req, res);
      break;
    default:
      res.statusCode = 400;
      res.end();
  }
};

export default photoApiRoute;
