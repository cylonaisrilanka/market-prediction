
'use server';
/**
 * @fileOverview Filters inappropriate or offensive content from product descriptions using an AI model.
 * This flow takes a product description, analyzes its content for safety, and returns
 * either the original description (if safe) or a sanitized version.
 *
 * Exports:
 * - `filterProductDescription`: The main function to call this AI flow.
 * - `FilterProductDescriptionInput`: TypeScript type for the input to the flow.
 * - `FilterProductDescriptionOutput`: TypeScript type for the output of the flow.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

/**
 * Zod schema defining the input for the product description filtering flow.
 */
const FilterProductDescriptionInputSchema = z.object({
  description: z.string().describe('The product description to filter.'),
});
export type FilterProductDescriptionInput = z.infer<typeof FilterProductDescriptionInputSchema>;

/**
 * Zod schema defining the output for the product description filtering flow.
 */
const FilterProductDescriptionOutputSchema = z.object({
  filteredDescription: z
    .string()
    .describe('The filtered product description, free of inappropriate content.'),
  isSafe: z.boolean().describe('Whether the original description was deemed safe by the AI.'),
});
export type FilterProductDescriptionOutput = z.infer<typeof FilterProductDescriptionOutputSchema>;

/**
 * Asynchronously filters a product description for inappropriate content.
 * This function serves as a wrapper around the Genkit flow.
 * @param {FilterProductDescriptionInput} input - The product description to filter.
 * @returns {Promise<FilterProductDescriptionOutput>} A promise that resolves to the filtered description and safety status.
 */
export async function filterProductDescription(
  input: FilterProductDescriptionInput
): Promise<FilterProductDescriptionOutput> {
  return filterProductDescriptionFlow(input);
}

/**
 * Genkit prompt definition for filtering product descriptions.
 * It defines the input and output schemas for the AI model and provides the instructional prompt.
 */
const prompt = ai.definePrompt({
  name: 'filterProductDescriptionPrompt', // A unique name for this prompt within Genkit.
  input: {
    schema: z.object({ // Re-defining schema here as per Genkit's prompt input structure.
      description: z.string().describe('The product description to filter.'),
    }),
  },
  output: {
    schema: z.object({ // Re-defining schema here as per Genkit's prompt output structure.
      filteredDescription: z
        .string()
        .describe('The filtered product description, free of inappropriate content.'),
      isSafe: z.boolean().describe('Whether the original description was deemed safe.'),
    }),
  },
  // The instructional text given to the AI model.
  // Handlebars `{{{description}}}` is used for unescaped HTML/text insertion.
  prompt: `You are an AI assistant specialized in filtering product descriptions to ensure they are appropriate and brand-safe.

  Analyze the following product description and determine if it contains any inappropriate or offensive content. If the description is safe, return it as is and set isSafe to true. If the description contains inappropriate content, filter it to remove the offensive parts and set isSafe to false. Make sure the filtered description remains coherent and relevant to the product.

  Product Description: {{{description}}}`,
});

/**
 * Genkit flow definition for filtering product descriptions.
 * This flow takes the input, passes it to the defined prompt, and returns the AI's output.
 */
const filterProductDescriptionFlow = ai.defineFlow<
  typeof FilterProductDescriptionInputSchema, // Type for input validation using Zod.
  typeof FilterProductDescriptionOutputSchema // Type for output validation using Zod.
>({
  name: 'filterProductDescriptionFlow', // A unique name for this flow within Genkit.
  inputSchema: FilterProductDescriptionInputSchema,
  outputSchema: FilterProductDescriptionOutputSchema,
},
async input => {
  // Execute the prompt with the given input.
  const {output} = await prompt(input);
  // The output from the prompt might be null if the AI fails to respond or the response doesn't match the schema.
  // The `!` asserts that output is not null; consider more robust error handling in production.
  return output!;
});
