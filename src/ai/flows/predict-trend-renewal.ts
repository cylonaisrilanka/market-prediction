'use server';
/**
 * @fileOverview Predicts garment trend renewals based on product description using AI analysis and visualizes future trends with time series analysis.
 *
 * - predictTrendRenewal - A function that predicts trend renewals based on product description.
 * - PredictTrendRenewalInput - The input type for the predictTrendRenewal function.
 * - PredictTrendRenewalOutput - The return type for the predictTrendRenewal function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const PredictTrendRenewalInputSchema = z.object({
  productDescription: z.string().describe('The product description of the fashion design.'),
  location: z.string().describe('The target location for the trend analysis.'),
  ageSuitability: z.string().describe('The target age group for the fashion design.'),
  gender: z.string().describe('The target gender for the fashion design.')
});

export type PredictTrendRenewalInput = z.infer<typeof PredictTrendRenewalInputSchema>;

const PredictTrendRenewalOutputSchema = z.object({
  predictedTrend: z.string().describe('The predicted trend renewal for the fashion design based on AI analysis.'),
  trendAnalysis: z.string().describe('Detailed trend analysis based on historical data and market insights.'),
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
      location: z.string().describe('The target location for the trend analysis.'),
      ageSuitability: z.string().describe('The target age group for the fashion design.'),
      gender: z.string().describe('The target gender for the fashion design.')
    }),
  },
  output: {
    schema: z.object({
      predictedTrend: z.string().describe('The predicted trend renewal for the fashion design based on AI analysis.'),
      trendAnalysis: z.string().describe('Detailed trend analysis based on historical data and market insights.'),
    }),
  },
  prompt: `You are an AI assistant specialized in predicting fashion trend renewals.

Analyze the following fashion design description, considering the target location, age suitability, and gender. Use historical data and market analysis to predict its potential trend renewal. Provide a predicted trend renewal summary and a detailed analysis of the trend, explaining the factors considered (e.g., past cycles, current market sentiment, similar item performance).

Fashion Design Description: {{{productDescription}}}
Target Location: {{{location}}}
Target Age Suitability: {{{ageSuitability}}}
Target Gender: {{{gender}}}`,
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
