
// src/contexts/auth-context.tsx
'use client';
/**
 * @fileOverview Authentication context for Firebase.
 * Provides user authentication state (user object, loading status) and
 * methods for sign up, log in, and log out throughout the application.
 * It uses Firebase Authentication services.
 */

import type { User } from 'firebase/auth'; // Firebase User type
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  onAuthStateChanged,         // Firebase listener for auth state changes
  createUserWithEmailAndPassword, // Firebase function to create a new user
  signInWithEmailAndPassword, // Firebase function to sign in a user
  signOut,                    // Firebase function to sign out a user
  type Auth,                  // Firebase Auth type
} from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase'; // Local Firebase auth instance
import { useRouter } from 'next/navigation'; // Next.js router for navigation

/**
 * Defines the shape of the authentication context.
 */
interface AuthContextType {
  /** The current Firebase User object, or null if not authenticated. */
  user: User | null;
  /** Boolean indicating if the authentication state is currently being loaded. */
  loading: boolean;
  /**
   * Signs up a new user with email and password.
   * @param {string} email - The user's email.
   * @param {string} pass - The user's password.
   * @returns {Promise<any>} A promise that resolves upon successful signup or rejects with an error.
   */
  signUp: (email: string, pass: string) => Promise<any>;
  /**
   * Logs in an existing user with email and password.
   * @param {string} email - The user's email.
   * @param {string} pass - The user's password.
   * @returns {Promise<any>} A promise that resolves upon successful login or rejects with an error.
   */
  logIn: (email: string, pass: string) => Promise<any>;
  /**
   * Logs out the current user.
   * @returns {Promise<void>} A promise that resolves upon successful logout.
   */
  logOut: () => Promise<void>;
}

/**
 * React context for authentication.
 * Initialized as undefined and checked in `useAuth` to ensure provider usage.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component.
 * Wraps parts of the application that need access to authentication state.
 * Manages the user's authentication status and provides auth functions via context.
 * @param {Readonly<{ children: ReactNode }>} props - Props containing the children elements to render.
 * @returns {JSX.Element} The AuthContext.Provider wrapping its children.
 */
export const AuthProvider = ({ children }: Readonly<{ children: ReactNode }>) => {
  const [user, setUser] = useState<User | null>(null); // Holds the current user object
  const [loading, setLoading] = useState(true); // Tracks initial auth state loading
  const router = useRouter();

  // Effect to subscribe to Firebase's authentication state changes.
  // Sets the user and loading state accordingly.
  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user state
      setLoading(false);    // Set loading to false once auth state is determined
    });
    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Firebase sign up function.
   */
  const signUp = (email: string, pass: string) => {
    return createUserWithEmailAndPassword(auth, email, pass);
  };

  /**
   * Firebase log in function.
   */
  const logIn = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  /**
   * Firebase log out function.
   * Redirects to the home page after logout.
   */
  const logOut = async () => {
    await signOut(auth);
    router.push('/'); // Redirect to home page after logout
  };

  // Provide the auth state and functions to child components
  return (
    <AuthContext.Provider value={{ user, loading, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook `useAuth` to access the authentication context.
 * Throws an error if used outside of an `AuthProvider`.
 * @returns {AuthContextType} The authentication context value.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
