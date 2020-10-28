import { useContext } from 'react';

import { FirebaseContext, FirebaseState } from '../lib/firebaseContext';

const useFirebase = (): FirebaseState['firebase'] => {
  const context = useContext(FirebaseContext);

  if (!context)
    throw new Error(
      'FirebaseContext must be used within a FirebaseContextProvider'
    );

  const { firebase } = context;

  return firebase;
};

export default useFirebase;
