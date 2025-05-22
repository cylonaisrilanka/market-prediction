
/**
 * @fileOverview Development server entry point for Genkit.
 * This file imports all the Genkit flows defined in the application,
 * making them available to the Genkit development server.
 * When `npm run genkit:dev` or `npm run genkit:watch` is executed,
 * Genkit uses this file to discover and start the defined flows.
 */

import '@/ai/flows/filter-product-description.ts';
import '@/ai/flows/generate-product-description.ts';
import '@/ai/flows/predict-trend-renewal.ts';
