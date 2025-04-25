'use server';
/**
 * @fileOverview Filters inappropriate or offensive content from product descriptions.
 *
 * - filterProductDescription - A function that filters product descriptions.
 * - FilterProductDescriptionInput - The input type for the filterProductDescription function.
 * - FilterProductDescriptionOutput - The return type for the filterProductDescription function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const FilterProductDescriptionInputSchema = z.object({
  description: z.string().describe('The product description to filter.'),
});
export type FilterProductDescriptionInput = z.infer<typeof FilterProductDescriptionInputSchema>;

const FilterProductDescriptionOutputSchema = z.object({
  filteredDescription: z
    .string()
    .describe('The filtered product description, free of inappropriate content.'),
  isSafe: z.boolean().describe('Whether the original description was deemed safe.'),
});
export type FilterProductDescriptionOutput = z.infer<typeof FilterProductDescriptionOutputSchema>;

export async function filterProductDescription(
  input: FilterProductDescriptionInput
): Promise<FilterProductDescriptionOutput> {
  return filterProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'filterProductDescriptionPrompt',
  input: {
    schema: z.object({
      description: z.string().describe('The product description to filter.'),
    }),
  },
  output: {
    schema: z.object({
      filteredDescription: z
        .string()
        .describe('The filtered product description, free of inappropriate content.'),
      isSafe: z.boolean().describe('Whether the original description was deemed safe.'),
    }),
  },
  prompt: `You are an AI assistant specialized in filtering product descriptions to ensure they are appropriate and brand-safe.

  Analyze the following product description and determine if it contains any inappropriate or offensive content. If the description is safe, return it as is and set isSafe to true. If the description contains inappropriate content, filter it to remove the offensive parts and set isSafe to false. Make sure the filtered description remains coherent and relevant to the product.

  Product Description: {{{description}}}`,
});

const filterProductDescriptionFlow = ai.defineFlow<
  typeof FilterProductDescriptionInputSchema,
  typeof FilterProductDescriptionOutputSchema
>({
  name: 'filterProductDescriptionFlow',
  inputSchema: FilterProductDescriptionInputSchema,
  outputSchema: FilterProductDescriptionOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
