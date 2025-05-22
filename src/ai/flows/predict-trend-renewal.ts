
'use server';
/**
 * @fileOverview Predicts garment trend renewals based on product description, target demographics, and location.
 * It provides a trend summary, detailed analysis including similar item context, market sentiment, confidence,
 * specific outlook for similar items/categories, and actionable sales improvement suggestions.
 * This flow uses an AI model to perform market analysis and forecasting.
 *
 * Exports:
 * - `predictTrendRenewal`: The main function to call this AI flow.
 * - `PredictTrendRenewalInput`: TypeScript type for the input to the flow.
 * - `PredictTrendRenewalOutput`: TypeScript type for the output of the flow.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

/**
 * Zod schema defining the input for the trend renewal prediction flow.
 * These details are provided by the user to give context to the AI.
 */
const PredictTrendRenewalInputSchema = z.object({
  productDescription: z.string().describe('The detailed product description of the fashion design, typically AI-generated from an image and basic details.'),
  location: z.string().describe('The target market location (e.g., Colombo, Kandy, Global).'),
  ageSuitability: z.string().describe('The target age group for the fashion design (e.g., 18-25, Teenagers, 30s).'),
  gender: z.string().describe('The target gender for the fashion design (e.g., Male, Female, Unisex).')
});
export type PredictTrendRenewalInput = z.infer<typeof PredictTrendRenewalInputSchema>;

/**
 * Zod schema for the analysis of similar items or categories.
 * This is a sub-schema used within the main output schema.
 */
const SimilarItemsAnalysisSchema = z.object({
  trendIndicator: z.string().describe("Indicates the general trend for similar items/categories: 'Strong Growth', 'Moderate Growth', 'Stable', 'Moderate Decline', 'Strong Decline', or 'Mixed/Volatile'.").default('Stable'),
  marketSentiment: z.string().describe("Overall market sentiment for similar items/categories: 'Very Positive', 'Positive', 'Neutral', 'Negative', 'Very Negative'.").default('Neutral')
}).describe("Analysis summary for similar items or categories in the target market.");

/**
 * Zod schema defining the output for the trend renewal prediction flow.
 * This structure dictates the format of the AI's response.
 */
const PredictTrendRenewalOutputSchema = z.object({
  predictedTrend: z.string().describe("A concise summary of the predicted trend renewal for the specific uploaded item (e.g., 'Strong Renewal Likely', 'Niche Upswing Possible', 'Trend Expected to Fade')."),
  trendAnalysis: z.string().describe("Detailed analysis for the specific uploaded item, including factors supporting the prediction, discussion of similar items/categories' impact, and potential challenges/opportunities."),
  marketSentiment: z.string().describe("Overall market sentiment for this specific type of item in the target market (e.g., Very Positive, Positive, Neutral, Negative, Very Negative)."),
  confidenceLevel: z.string().describe("The AI's confidence in this prediction for the specific item (e.g., High, Medium, Low)."),
  similarItemsAnalysis: SimilarItemsAnalysisSchema.default({ trendIndicator: 'Stable', marketSentiment: 'Neutral' }).describe("Structured analysis of how similar items or the broader fashion category are faring."),
  salesImprovementSuggestions: z.array(z.string()).describe("Actionable suggestions (2-4 bullet points) to potentially improve sales for the specific uploaded item, based on the trend analysis.").optional(),
});
export type PredictTrendRenewalOutput = z.infer<typeof PredictTrendRenewalOutputSchema>;

/**
 * Asynchronously predicts fashion trend renewal using AI.
 * This function serves as a wrapper around the Genkit flow.
 * @param {PredictTrendRenewalInput} input - The product description and market context details.
 * @returns {Promise<PredictTrendRenewalOutput>} A promise that resolves to the AI's trend prediction and analysis.
 */
export async function predictTrendRenewal(input: PredictTrendRenewalInput): Promise<PredictTrendRenewalOutput> {
  return predictTrendRenewalFlow(input);
}

/**
 * Genkit prompt definition for predicting fashion trend renewals.
 * It specifies the input and output schemas for the AI model and provides detailed instructions.
 */
const prompt = ai.definePrompt({
  name: 'predictTrendRenewalPrompt', // Unique name for this prompt.
  input: { schema: PredictTrendRenewalInputSchema },
  output: { schema: PredictTrendRenewalOutputSchema },
  // Detailed instructional prompt for the AI model.
  // Handlebars `{{{field}}}` syntax is used for inserting input values into the prompt.
  prompt: `You are an expert fashion market analyst and trend forecaster with deep knowledge of global and local fashion dynamics.

Analyze the following fashion design details:
- Product Description: {{{productDescription}}}
- Target Location: {{{location}}}
- Target Age Suitability: {{{ageSuitability}}}
- Target Gender: {{{gender}}}

Based on this information, provide the following:

1.  **predictedTrend**: A concise summary statement about the design's likely trend renewal (e.g., 'Strong Renewal Likely', 'Niche Upswing Possible', 'Trend Expected to Fade', 'Steady Demand Foreseen', 'Emerging Micro-Trend').
2.  **trendAnalysis**: A comprehensive analysis (2-3 paragraphs) covering:
    *   Key factors supporting your prediction for the specific item (e.g., current market sentiment for this style, recent runway influences, social media buzz, sustainability aspects if inferable from description, cultural relevance in the target location).
    *   How *similar items or fashion categories* are currently performing or have performed historically in the target market and globally. Discuss how this context impacts the outlook for the provided design.
    *   Potential challenges (e.g., market saturation, shifting consumer preferences, competition) and opportunities (e.g., untapped niches, potential for cross-cultural appeal, unique selling propositions) for this specific design.
3.  **marketSentiment**: The overall market sentiment for this *specific type* of fashion item in the specified target location for the next 5-6 months. Choose one: Very Positive, Positive, Neutral, Negative, Very Negative.
4.  **confidenceLevel**: Your confidence level in this overall prediction and analysis for the specific item. Choose one: High, Medium, Low.
5.  **similarItemsAnalysis**: Provide a structured summary for how *similar items or the broader fashion category* are generally faring in the target market:
    *   **trendIndicator**: Choose one to describe the general trend for these similar items/categories: 'Strong Growth', 'Moderate Growth', 'Stable', 'Moderate Decline', 'Strong Decline', or 'Mixed/Volatile'.
    *   **marketSentiment**: Choose one for the overall market sentiment for these similar items/categories: 'Very Positive', 'Positive', 'Neutral', 'Negative', 'Very Negative'.
6.  **salesImprovementSuggestions**: Based on your overall analysis of the design, its predicted trend, and market sentiment, provide 2-4 concise, actionable bullet-point suggestions that could help improve its sales potential. These could relate to marketing angles, specific target niches, minor design considerations (if appropriate and inferable), or pricing strategies relevant to the perceived trend. Focus on high-impact, realistic advice.

Ensure your language is professional, insightful, and actionable for a fashion designer or brand.
Focus on providing a realistic and data-informed perspective, even if simulated based on your extensive knowledge.
`,
});

/**
 * Genkit flow definition for predicting fashion trend renewals.
 * This flow orchestrates the call to the AI model via the defined prompt.
 * It includes basic error handling and default values for the output if the AI fails.
 */
const predictTrendRenewalFlow = ai.defineFlow(
  {
    name: 'predictTrendRenewalFlow', // Unique name for this flow.
    inputSchema: PredictTrendRenewalInputSchema,
    outputSchema: PredictTrendRenewalOutputSchema,
  },
  async input => {
    // Execute the prompt with the validated input.
    const {output} = await prompt(input);

    // Basic error handling: if the AI output is null or undefined, throw an error.
    if (!output) {
      throw new Error("AI failed to generate a trend prediction. Output was null.");
    }

    // Ensure all fields are present in the output, providing defaults if necessary
    // This makes the consuming component more resilient to partial AI responses.
    return {
      predictedTrend: output.predictedTrend || "Analysis Incomplete",
      trendAnalysis: output.trendAnalysis || "Detailed analysis could not be generated.",
      marketSentiment: output.marketSentiment || "Neutral",
      confidenceLevel: output.confidenceLevel || "Medium",
      similarItemsAnalysis: output.similarItemsAnalysis || { trendIndicator: 'Stable', marketSentiment: 'Neutral' },
      salesImprovementSuggestions: output.salesImprovementSuggestions || [],
    };
  }
);
