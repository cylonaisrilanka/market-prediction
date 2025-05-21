import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const googleGenaiApiKey = process.env.GOOGLE_GENAI_API_KEY;

if (!googleGenaiApiKey) {
  const errorMessage =
    'CRITICAL ERROR: Google Generative AI API Key (GOOGLE_GENAI_API_KEY) is UNDEFINED. ' +
    'This means the .env file is likely missing, in the wrong location, not named correctly (must be `.env`), ' +
    'or the `GOOGLE_GENAI_API_KEY` variable is missing from it or misspelled. ' +
    'Please check your project root for a `.env` file, ensure it contains `GOOGLE_GENAI_API_KEY="YOUR_KEY_HERE"`, ' +
    'and that you have RESTARTED your development server (e.g., `npm run dev` and `npm run genkit:dev` if applicable) ' +
    'after creating or modifying the .env file.';
  console.error(errorMessage);
  throw new Error(errorMessage);
}

export const ai = genkit({
  promptDir: './prompts',
  plugins: [
    googleAI({
      apiKey: googleGenaiApiKey,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
