'use server';
/**
 * @fileOverview Predicts garment trend renewals based on search data using Gemini and visualizes future trends with time series analysis.
 *
 * - predictTrendRenewal - A function that predicts trend renewals based on search data.
 * - PredictTrendRenewalInput - The input type for the predictTrendRenewal function.
 * - PredictTrendRenewalOutput - The return type for the predictTrendRenewal function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const PredictTrendRenewalInputSchema = z.object({
  productDescription: z.string().describe('The product description of the fashion design.'),
});

export type PredictTrendRenewalInput = z.infer<typeof PredictTrendRenewalInputSchema>;

const PredictTrendRenewalOutputSchema = z.object({
  predictedTrend: z.string().describe('The predicted trend renewal for the fashion design based on Gemini search analysis.'),
  trendAnalysis: z.string().describe('Detailed trend analysis from Gemini.'),
});

export type PredictTrendRenewalOutput = z.infer<typeof PredictTrendRenewalOutputSchema>;

export async function predictTrendRenewal(input: PredictTrendRenewalInput): Promise<PredictTrendRenewalOutput> {
  return predictTrendRenewalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictTrendRenewalPrompt',
  input: {
    schema: z.object({
      productDescription: z.string().describe('The product description of the fashion design.'),
    }),
  },
  output: {
    schema: z.object({
      predictedTrend: z.string().describe('The predicted trend renewal for the fashion design based on Gemini search analysis.'),
      trendAnalysis: z.string().describe('Detailed trend analysis from Gemini.'),
    }),
  },
  prompt: `You are an AI assistant specialized in predicting fashion trend renewals based on Gemini search data.

Analyze the following fashion design description and use Gemini to search for similar trends, historical data, and market analysis. Provide a predicted trend renewal and a detailed analysis of the trend.

Fashion Design Description: {{{productDescription}}}`,
});

const predictTrendRenewalFlow = ai.defineFlow<
  typeof PredictTrendRenewalInputSchema,
  typeof PredictTrendRenewalOutputSchema
>({
  name: 'predictTrendRenewalFlow',
  inputSchema: PredictTrendRenewalInputSchema,
  outputSchema: PredictTrendRenewalOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
