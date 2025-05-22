
/**
 * @fileOverview Initializes and configures the Genkit AI instance with the Google AI plugin.
 * This file is crucial for connecting the application to Google's generative AI models (Gemini).
 * It includes a critical check for the Google Generative AI API key to ensure it's properly set
 * in the environment variables, as the application cannot function without it.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Retrieve the Google Generative AI API Key from environment variables.
// This key is essential for authenticating requests to Google AI services.
const googleGenaiApiKey = process.env.GOOGLE_GENAI_API_KEY;

// CRITICAL CHECK: Ensure the Google Generative AI API Key is defined and not an empty string.
// If the key is missing or empty, the application cannot interact with Google AI services.
// This check provides a detailed error message to help developers troubleshoot .env file configuration.
if (!googleGenaiApiKey || googleGenaiApiKey.trim() === '') {
  const errorMessage =
    'CRITICAL ERROR: Google Generative AI API Key (GOOGLE_GENAI_API_KEY) is UNDEFINED or EMPTY. ' +
    'This means the .env file is likely missing, in the wrong location, not named correctly (must be `.env`), ' +
    'the `GOOGLE_GENAI_API_KEY` variable is missing from it, misspelled, or set to an empty string. ' +
    'Please check your project root for a `.env` file, ensure it contains `GOOGLE_GENAI_API_KEY="YOUR_KEY_HERE"`, ' +
    'and that you have RESTARTED your development server(s) (e.g., `npm run dev` and `npm run genkit:dev`) ' +
    'after creating or modifying the .env file.';
  console.error(errorMessage); // Log the detailed error message to the console.
  throw new Error(errorMessage); // Halt execution to prevent further errors.
}

/**
 * The global Genkit AI instance, configured for use throughout the application.
 * It's initialized with the Google AI plugin, providing access to models like Gemini.
 *
 * @property {string} promptDir - Specifies a directory where Genkit might look for prompt files.
 *                                 (Note: In this setup, prompts are defined directly in code.)
 * @property {Array<Plugin<any>>} plugins - An array of Genkit plugins. Here, it includes the `googleAI` plugin.
 * @property {string} model - Sets a default model for AI generation tasks. This can be overridden
 *                            in specific flow or prompt definitions if needed.
 */
export const ai = genkit({
  promptDir: './prompts', // Default directory for Genkit prompts, if any were stored as separate files.
  plugins: [
    googleAI({
      apiKey: googleGenaiApiKey, // Pass the validated API key to the Google AI plugin.
    }),
  ],
  model: 'googleai/gemini-2.0-flash', // Default model specified for AI generation tasks (e.g., Gemini Flash).
});
