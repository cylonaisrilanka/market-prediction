'use server';
/**
 * @fileOverview An AI agent that generates product descriptions based on product image and additional details.
 *
 * - generateProductDescription - A function that handles the product description generation process.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  productImageDataUri: z
    .string()
    .describe(
      "A product image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  additionalDetails: z.string().describe('Any additional details about the product.'),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  productDescription: z.string().describe('The generated product description.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

export async function generateProductDescription(input: GenerateProductDescriptionInput): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {
    schema: z.object({
      productImageDataUri: z
        .string()
        .describe(
          "A product image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
      additionalDetails: z.string().describe('Any additional details about the product.'),
    }),
  },
  output: {
    schema: z.object({
      productDescription: z.string().describe('The generated product description.'),
    }),
  },
  prompt: `You are a fashion product description writer.

You will use the product image and additional details to generate a product description.

Product Image: {{media url=productImageDataUri}}
Additional Details: {{{additionalDetails}}}

Write a compelling and informative product description.`,
});

const generateProductDescriptionFlow = ai.defineFlow<
  typeof GenerateProductDescriptionInputSchema,
  typeof GenerateProductDescriptionOutputSchema
>({
  name: 'generateProductDescriptionFlow',
  inputSchema: GenerateProductDescriptionInputSchema,
  outputSchema: GenerateProductDescriptionOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
