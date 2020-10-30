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

const uploadApiRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  try {
    if (req.method?.toLowerCase() !== 'post') throw new Error();

    const auth = req.headers.authorization
      ? req.headers.authorization.replace('Bearer ', '')
      : '';

    if (!auth) throw new Error();

    const token = JSON.parse(atob(auth));
    const credential = firebase.auth.AuthCredential.fromJSON(token);

    if (!credential) throw new Error();

    await firebase.auth().signInWithCredential(credential);

    const formData = new FormData();
    formData.append('useUniqueFileName', 'false');

    Object.keys(req.body).forEach((key) => formData.append(key, req.body[key]));

    const imageRes = await fetch(
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

    if (imageRes.status !== 200) throw new Error();

    res.statusCode = 200;
    res.end();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    res.statusCode = req.method?.toLowerCase() === 'post' ? 401 : 400;
    res.end();
  }
};

export default uploadApiRoute;
