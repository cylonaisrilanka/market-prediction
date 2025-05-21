// src/lib/firebase/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (!apiKey || apiKey.trim() === '') {
  const errorMessage =
    'CRITICAL ERROR: Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is UNDEFINED or EMPTY. ' +
    'This means the .env file is likely missing, in the wrong location, not named correctly (must be `.env`), ' +
    'the `NEXT_PUBLIC_FIREBASE_API_KEY` variable is missing from it, misspelled, or set to an empty string. ' +
    'Please check your project root for a `.env` file, ensure it contains `NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_KEY_HERE"`, ' +
    'and that you have RESTARTED your development server (e.g., `npm run dev`) after creating or modifying the .env file.';
  console.error(errorMessage);
  throw new Error(errorMessage);
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);

export { app, auth };
