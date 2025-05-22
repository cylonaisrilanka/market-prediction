
// src/lib/firebase/firebase.ts
/**
 * @fileOverview Firebase initialization module.
 * Configures and initializes the Firebase app and Authentication service.
 * It reads Firebase configuration from environment variables and includes
 * critical checks to ensure API keys are properly set up.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

// Retrieve the Firebase API Key from environment variables.
// NEXT_PUBLIC_ prefix is used by Next.js to expose variables to the browser.
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// CRITICAL CHECK: Ensure the Firebase API Key is present and not an empty string.
// This check helps diagnose .env file configuration issues early.
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
  console.error(errorMessage); // Log the error to the console for visibility.
  throw new Error(errorMessage); // Throw an error to halt execution if the key is missing.
}

/**
 * Firebase configuration object.
 * Values are read from environment variables prefixed with `NEXT_PUBLIC_`.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional for Google Analytics
};

/**
 * Firebase App instance.
 * Initializes Firebase if it hasn't been already, otherwise gets the existing app instance.
 * This prevents re-initializing Firebase on every hot reload in development.
 */
let app: FirebaseApp;
if (!getApps().length) { // Check if any Firebase apps have already been initialized
  app = initializeApp(firebaseConfig); // Initialize if no app exists
} else {
  app = getApp(); // Get the default app if already initialized
}

/**
 * Firebase Auth instance.
 * Retrieved from the initialized Firebase app instance.
 */
const auth: Auth = getAuth(app);

// Export the initialized Firebase app and auth instances for use throughout the application.
export { app, auth };
