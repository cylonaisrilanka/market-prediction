
/**
 * @fileOverview Utility functions for the application.
 * Includes the `cn` function for conditionally joining class names,
 * which is a common pattern in Tailwind CSS projects.
 */
import { clsx, type ClassValue } from "clsx" // clsx is a utility for constructing className strings conditionally.
import { twMerge } from "tailwind-merge" // tailwind-merge resolves conflicting Tailwind classes.

/**
 * Combines multiple class names into a single string, resolving Tailwind CSS conflicts.
 * This is a common utility in projects using Tailwind CSS with component libraries.
 *
 * @param {...ClassValue} inputs - A list of class values to combine.
 *                                 These can be strings, arrays, or objects.
 * @returns {string} A string of combined and de-duplicated class names.
 *
 * @example
 * cn("p-4", "bg-red-500", { "text-white": true, "font-bold": false });
 * // Result depends on Tailwind configuration, but typically resolves conflicts
 * // e.g., if bg-red-500 and bg-blue-500 were passed, twMerge would pick one.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
