
'use server';
/**
 * @fileOverview An AI agent that generates product descriptions based on product image and additional details.
 * This flow uses a multimodal AI model to understand an image and textual details to craft
 * a compelling product description.
 *
 * Exports:
 * - `generateProductDescription`: The main function to call this AI flow.
 * - `GenerateProductDescriptionInput`: TypeScript type for the input to the flow.
 * - `GenerateProductDescriptionOutput`: TypeScript type for the output of the flow.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

/**
 * Zod schema defining the input for the product description generation flow.
 */
const GenerateProductDescriptionInputSchema = z.object({
  productImageDataUri: z
    .string()
    .describe(
      "A product image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  additionalDetails: z.string().describe('Any additional details about the product, such as target market, price, or key features.'),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

/**
 * Zod schema defining the output for the product description generation flow.
 */
const GenerateProductDescriptionOutputSchema = z.object({
  productDescription: z.string().describe('The generated product description.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

/**
 * Asynchronously generates a product description using AI.
 * This function serves as a wrapper around the Genkit flow.
 * @param {GenerateProductDescriptionInput} input - The product image data URI and additional details.
 * @returns {Promise<GenerateProductDescriptionOutput>} A promise that resolves to the generated product description.
 */
export async function generateProductDescription(input: GenerateProductDescriptionInput): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

/**
 * Genkit prompt definition for generating product descriptions.
 * It defines the input (image and text) and output schemas for the AI model, and provides the instructional prompt.
 */
const prompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt', // Unique name for this prompt.
  input: {
    schema: z.object({ // Re-defining schema as per Genkit's prompt input structure.
      productImageDataUri: z
        .string()
        .describe(
          "A product image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
      additionalDetails: z.string().describe('Any additional details about the product.'),
    }),
  },
  output: {
    schema: z.object({ // Re-defining schema as per Genkit's prompt output structure.
      productDescription: z.string().describe('The generated product description.'),
    }),
  },
  // The instructional text given to the AI model.
  // `{{media url=productImageDataUri}}` is Handlebars syntax for embedding media from a data URI.
  // `{{{additionalDetails}}}` is for unescaped text insertion.
  prompt: `You are a fashion product description writer.

You will use the product image and additional details to generate a product description.

Product Image: {{media url=productImageDataUri}}
Additional Details: {{{additionalDetails}}}

Write a compelling and informative product description. Focus on the design elements, style, potential use cases, and material if inferable from the image or details.`,
});

/**
 * Genkit flow definition for generating product descriptions.
 * This flow takes the input, passes it to the defined multimodal prompt, and returns the AI's generated description.
 */
const generateProductDescriptionFlow = ai.defineFlow<
  typeof GenerateProductDescriptionInputSchema, // Type for input validation.
  typeof GenerateProductDescriptionOutputSchema // Type for output validation.
>({
  name: 'generateProductDescriptionFlow', // Unique name for this flow.
  inputSchema: GenerateProductDescriptionInputSchema,
  outputSchema: GenerateProductDescriptionOutputSchema,
}, async input => {
  // Execute the prompt with the given input.
  const {output} = await prompt(input);
  // The output might be null if the AI fails. Consider robust error handling.
  return output!;
});
