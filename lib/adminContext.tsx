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
  initialized: boolean;
  loginUser: (email: string, password: string) => Promise<AdminUser>;
  logoutUser: () => void;
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
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(
    parseUserFromToken(retrieveToken())
  );
  const [userInitialized, setUserInitialized] = useState(false);
  const firebase = useFirebase();

  const resetUser = () => {
    setUser(null);
    window.localStorage.removeItem('auth');
  };

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

  const logoutUser = useCallback(() => {
    resetUser();
    firebase.auth().signOut();
  }, [firebase]);

  const initializeUser = useCallback(async () => {
    if (user) {
      try {
        const credential = firebase.auth.AuthCredential.fromJSON(
          decodeToken(user.token)
        );

        if (credential) {
          await firebase.auth().signInWithCredential(credential);
        } else {
          await firebase.auth().signOut();
          resetUser();
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      } finally {
        setUserInitialized(true);
      }
    } else {
      setUserInitialized(true);
    }
  }, [firebase, user]);

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      initializeUser();
    }
  }, [initializeUser, initialized, user]);

  return (
    <AdminContext.Provider
      value={{ user, loginUser, logoutUser, initialized: userInitialized }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
