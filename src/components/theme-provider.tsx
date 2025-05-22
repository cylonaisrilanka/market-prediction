
'use client';
/**
 * @fileOverview ThemeProvider component.
 * Wraps the application to provide theme (light/dark/system) context
 * using the `next-themes` library.
 */

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types'; // Import props type

/**
 * ThemeProvider functional component.
 * A simple wrapper around `NextThemesProvider` from the `next-themes` library.
 * It passes all props to the underlying provider, allowing configuration of
 * theme attributes, default theme, system theme enabling, etc.
 *
 * @param {ThemeProviderProps} props - Props for the NextThemesProvider, including `children`.
 * @returns {JSX.Element} The NextThemesProvider wrapping its children.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
