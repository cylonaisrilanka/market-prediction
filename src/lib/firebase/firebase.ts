
// src/lib/firebase/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (!apiKey || apiKey.trim() === '') {
  const errorMessage =
    'CRITICAL LOCAL SETUP ERROR: The Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing or empty in your environment.\n\n' +
    'THIS IS A PROBLEM WITH YOUR LOCAL .env FILE CONFIGURATION THAT **YOU** MUST FIX.\n\n' +
    'Follow these steps carefully on your local machine:\n' +
    '1. Ensure a file named EXACTLY `.env` exists in the ROOT directory of your project (same level as package.json).\n' +
    '2. Inside `.env`, ensure the line `NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_ACTUAL_FIREBASE_API_KEY"` is present, with your REAL API key.\n' +
    '3. Also, ensure ALL other `NEXT_PUBLIC_FIREBASE_...` variables are correctly set with your project details (authDomain, projectId, etc.).\n' +
    '4. **YOU MUST RESTART YOUR DEVELOPMENT SERVER** (e.g., stop `npm run dev` with Ctrl+C and run it again) after creating or modifying the .env file.\n\n' +
    'The application cannot proceed without this valid API key.';
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
