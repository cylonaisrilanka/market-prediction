
/**
 * @fileOverview Initializes and configures the Genkit AI instance with the Google AI plugin.
 * This file is crucial for connecting the application to Google's generative AI models.
 * It also includes a critical check for the Google Generative AI API key.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Retrieve the Google Generative AI API Key from environment variables.
const googleGenaiApiKey = process.env.GOOGLE_GENAI_API_KEY;

// Critical check: Ensure the API key is defined and not an empty string.
// If the key is missing, the application cannot interact with Google AI services.
if (!googleGenaiApiKey || googleGenaiApiKey.trim() === '') {
  const errorMessage =
    'CRITICAL ERROR: Google Generative AI API Key (GOOGLE_GENAI_API_KEY) is UNDEFINED or EMPTY. ' +
    'This means the .env file is likely missing, in the wrong location, not named correctly (must be `.env`), ' +
    'the `GOOGLE_GENAI_API_KEY` variable is missing from it, misspelled, or set to an empty string. ' +
    'Please check your project root for a `.env` file, ensure it contains `GOOGLE_GENAI_API_KEY="YOUR_KEY_HERE"`, ' +
    'and that you have RESTARTED your development server (e.g., `npm run dev` and `npm run genkit:dev` if applicable) ' +
    'after creating or modifying the .env file.';
  console.error(errorMessage);
  throw new Error(errorMessage);
}

/**
 * The global Genkit AI instance.
 * Configured with the Google AI plugin and a default model.
 * `promptDir` specifies the directory where Genkit might look for prompt files (though not strictly used in this setup).
 * `model` sets a default model which can be overridden in specific flow or prompt definitions.
 */
export const ai = genkit({
  promptDir: './prompts', // Default directory for Genkit prompts, if any were stored as separate files.
  plugins: [
    googleAI({
      apiKey: googleGenaiApiKey, // Pass the validated API key to the plugin.
    }),
  ],
  model: 'googleai/gemini-2.0-flash', // Default model for AI generation tasks.
});
