import React, { createContext } from 'react';
import config from 'config';
import atob from 'atob';

import firebase from './firebase';

const firebaseAuthConfig = config.get<string>('public.firebase.auth');
const parsedFirebaseConfig = JSON.parse(atob(firebaseAuthConfig));

export interface FirebaseState {
  firebase: typeof firebase;
}

export const FirebaseContext = createContext<FirebaseState | undefined>(
  undefined
);

const FirebaseProvider: React.FC = ({ children }) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(parsedFirebaseConfig);
  }

  return (
    <FirebaseContext.Provider value={{ firebase }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
