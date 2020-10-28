import React, { createContext, useCallback, useEffect, useState } from 'react';
import fb from './firebase';

import useFirebase from '../hooks/useFirebase';

export interface AdminUserToken {
  a: string; // email
  f: string; // password
  providerId: string;
  signInMethod: string;
}

export interface AdminUser {
  email: string;
  token: string;
}

export interface AdminState {
  user: AdminUser | null;
  loginUser: (email: string, password: string) => Promise<AdminUser>;
}

export const AdminContext = createContext<AdminState | undefined>(undefined);

const decodeToken = (token: string) => {
  if (!token) return null;

  return JSON.parse(atob(token));
};

const encodeToken = (credential: fb.auth.AuthCredential): string =>
  btoa(JSON.stringify(credential.toJSON()));

const persistToken = (token: string) => {
  window.localStorage.setItem('auth', token);
};

const retrieveToken = (): string => {
  if (typeof window === 'undefined') return '';

  const persistedToken = window.localStorage.getItem('auth');

  if (!persistedToken) return '';

  return persistedToken;
};

const parseUserFromToken = (token: string): AdminUser | null => {
  if (!token) return null;

  const encodedToken = decodeToken(token);

  const user = {
    email: encodedToken.a,
    token,
  };

  return user;
};

const AdminProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(
    parseUserFromToken(retrieveToken())
  );
  const firebase = useFirebase();

  const loginUser = useCallback(
    async (email: string, password: string) => {
      const credential = firebase.auth.EmailAuthProvider.credential(
        email,
        password
      );

      await firebase.auth().signInWithCredential(credential);
      const token = encodeToken(credential);

      persistToken(token);

      const nextUser = {
        email,
        token,
      };
      setUser(nextUser);

      return nextUser;
    },
    [firebase]
  );

  useEffect(() => {
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
      }
    });
  }, [firebase]);

  return (
    <AdminContext.Provider value={{ user, loginUser }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
