
'use client';

import type { User as FirebaseUser, AuthError } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase'; // Corrected import path

interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
  error: AuthError | null;
  signup: (email: string, password: string) => Promise<UserCredential | AuthError>;
  login: (email: string, password: string) => Promise<UserCredential | AuthError>;
  logout: () => Promise<void | AuthError>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      setError(null);
    }, (err) => {
      setError(err);
      setCurrentUser(null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string): Promise<UserCredential | AuthError> => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // No need to setCurrentUser here, onAuthStateChanged will handle it
      setLoading(false);
      return userCredential;
    } catch (err) {
      setError(err as AuthError);
      setLoading(false);
      console.error("Signup error:", err);
      return err as AuthError;
    }
  };

  const login = async (email: string, password: string): Promise<UserCredential | AuthError> => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // No need to setCurrentUser here, onAuthStateChanged will handle it
      setLoading(false);
      return userCredential;
    } catch (err) {
      setError(err as AuthError);
      setLoading(false);
      console.error("Login error:", err);
      return err as AuthError;
    }
  };

  const logout = async (): Promise<void | AuthError> => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
      // No need to setCurrentUser here, onAuthStateChanged will handle it
      setLoading(false);
    } catch (err) {
      setError(err as AuthError);
      setLoading(false);
      console.error("Logout error:", err);
      return err as AuthError;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
