
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Ensure environment variables are prefixed with NEXT_PUBLIC_ to be exposed to the browser
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

if (!apiKey) {
  const errorMessage =
    'CRITICAL ERROR: Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is UNDEFINED. ' +
    'This means the .env file is likely missing, in the wrong location, not named correctly (must be `.env`), ' +
    'or the `NEXT_PUBLIC_FIREBASE_API_KEY` variable is missing from it or misspelled. ' +
    'Please check your project root for a `.env` file, ensure it contains `NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_KEY_HERE"`, ' +
    'and that you have RESTARTED your development server (e.g., `npm run dev`) after creating or modifying the .env file.';
  console.error(errorMessage);
  throw new Error(errorMessage);
}

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
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
