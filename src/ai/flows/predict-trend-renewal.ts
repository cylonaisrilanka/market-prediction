'use server';
/**
 * @fileOverview Predicts garment trend renewals based on product description, target demographics, and location.
 * It provides a trend summary, detailed analysis including similar item context, market sentiment, and confidence.
 *
 * - predictTrendRenewal - A function that predicts trend renewals.
 * - PredictTrendRenewalInput - The input type for the predictTrendRenewal function.
 * - PredictTrendRenewalOutput - The return type for the predictTrendRenewal function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const PredictTrendRenewalInputSchema = z.object({
  productDescription: z.string().describe('The detailed product description of the fashion design.'),
  location: z.string().describe('The target market location (e.g., Colombo, Kandy, Global).'),
  ageSuitability: z.string().describe('The target age group for the fashion design (e.g., 18-25, Teenagers, 30s).'),
  gender: z.string().describe('The target gender for the fashion design (e.g., Male, Female, Unisex).')
});

export type PredictTrendRenewalInput = z.infer<typeof PredictTrendRenewalInputSchema>;

const PredictTrendRenewalOutputSchema = z.object({
  predictedTrend: z.string().describe("A concise summary of the predicted trend renewal (e.g., 'Strong Renewal Likely', 'Niche Upswing Possible', 'Trend Expected to Fade')."),
  trendAnalysis: z.string().describe("Detailed analysis including factors supporting the prediction, discussion of similar items/categories, and potential challenges/opportunities."),
  marketSentiment: z.string().describe("Overall market sentiment for this type of item in the target market (e.g., Very Positive, Positive, Neutral, Negative, Very Negative)."),
  confidenceLevel: z.string().describe("The AI's confidence in this prediction (e.g., High, Medium, Low).")
});

export type PredictTrendRenewalOutput = z.infer<typeof PredictTrendRenewalOutputSchema>;

export async function predictTrendRenewal(input: PredictTrendRenewalInput): Promise<PredictTrendRenewalOutput> {
  return predictTrendRenewalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictTrendRenewalPrompt',
  input: { schema: PredictTrendRenewalInputSchema },
  output: { schema: PredictTrendRenewalOutputSchema },
  prompt: `You are an expert fashion market analyst and trend forecaster with deep knowledge of global and local fashion dynamics.

Analyze the following fashion design details:
- Product Description: {{{productDescription}}}
- Target Location: {{{location}}}
- Target Age Suitability: {{{ageSuitability}}}
- Target Gender: {{{gender}}}

Based on this information, provide the following:

1.  **predictedTrend**: A concise summary statement about the design's likely trend renewal (e.g., 'Strong Renewal Likely', 'Niche Upswing Possible', 'Trend Expected to Fade', 'Steady Demand Foreseen', 'Emerging Micro-Trend').
2.  **trendAnalysis**: A comprehensive analysis (2-3 paragraphs) covering:
    *   Key factors supporting your prediction (e.g., current market sentiment for this style, recent runway influences, social media buzz, sustainability aspects if inferable from description, cultural relevance in the target location).
    *   How *similar items or fashion categories* are currently performing or have performed historically in the target market and globally. Discuss how this context impacts the outlook for the provided design.
    *   Potential challenges (e.g., market saturation, shifting consumer preferences, competition) and opportunities (e.g., untapped niches, potential for cross-cultural appeal, unique selling propositions) for this design.
3.  **marketSentiment**: The overall market sentiment for this *type* of fashion item in the specified target location for the next 5-6 months. Choose one: Very Positive, Positive, Neutral, Negative, Very Negative.
4.  **confidenceLevel**: Your confidence level in this overall prediction and analysis. Choose one: High, Medium, Low.

Ensure your language is professional, insightful, and actionable for a fashion designer or brand.
Focus on providing a realistic and data-informed perspective, even if simulated based on your extensive knowledge.
`,
});

const predictTrendRenewalFlow = ai.defineFlow(
  {
    name: 'predictTrendRenewalFlow',
    inputSchema: PredictTrendRenewalInputSchema,
    outputSchema: PredictTrendRenewalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a trend prediction. Output was null.");
    }
    // Ensure all fields are present, provide defaults if necessary (though the model should provide them)
    return {
      predictedTrend: output.predictedTrend || "Analysis Incomplete",
      trendAnalysis: output.trendAnalysis || "Detailed analysis could not be generated.",
      marketSentiment: output.marketSentiment || "Neutral",
      confidenceLevel: output.confidenceLevel || "Medium",
    };
  }
);
