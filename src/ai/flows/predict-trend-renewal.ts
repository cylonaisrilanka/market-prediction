'use server';
/**
 * @fileOverview Predicts garment trend renewals based on historical data.
 *
 * - predictTrendRenewal - A function that predicts trend renewals.
 * - PredictTrendRenewalInput - The input type for the predictTrendRenewal function.
 * - PredictTrendRenewalOutput - The return type for the predictTrendRenewal function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const PredictTrendRenewalInputSchema = z.object({
  historicalData: z.string().describe('Historical trend data for the garment.'),
});
export type PredictTrendRenewalInput = z.infer<typeof PredictTrendRenewalInputSchema>;

const PredictTrendRenewalOutputSchema = z.object({
  predictedTrend: z.string().describe('The predicted trend renewal for the garment.'),
});
export type PredictTrendRenewalOutput = z.infer<typeof PredictTrendRenewalOutputSchema>;

export async function predictTrendRenewal(input: PredictTrendRenewalInput): Promise<PredictTrendRenewalOutput> {
  return predictTrendRenewalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictTrendRenewalPrompt',
  input: {
    schema: z.object({
      historicalData: z.string().describe('Historical trend data for the garment.'),
    }),
  },
  output: {
    schema: z.object({
      predictedTrend: z.string().describe('The predicted trend renewal for the garment.'),
    }),
  },
  prompt: `You are an AI assistant specialized in predicting garment trend renewals based on historical data.

Analyze the following historical trend data and predict the trend renewal for the garment.

Historical Trend Data: {{{historicalData}}}`,
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
