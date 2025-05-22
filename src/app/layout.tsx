
/**
 * @fileOverview Root layout component for the Next.js application.
 * This component wraps all pages and provides global context providers like
 * ThemeProvider for light/dark mode and AuthProvider for Firebase authentication.
 * It also sets up global metadata and font configurations.
 */

import type {Metadata} from 'next';
import { Geist } from 'next/font/google'; // Using Geist Sans font
import './globals.css'; // Importing global stylesheets
import { ThemeProvider } from '@/components/theme-provider'; // For light/dark theme management
import { AuthProvider } from '@/contexts/auth-context'; // For Firebase authentication state
import { Toaster } from '@/components/ui/toaster'; // For displaying toast notifications

/**
 * Configures the Geist Sans font with Latin subsets.
 * The `variable` option makes the font available as a CSS variable.
 */
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

/**
 * Global metadata for the application.
 * This includes the title and description used in browser tabs and SEO.
 */
export const metadata: Metadata = {
  title: 'FashionFlow AI',
  description: 'Predict the market trends for your fashion designs using AI.',
};

/**
 * RootLayout component.
 * This is the main layout that wraps all page content.
 * It sets up the HTML structure, applies global fonts, and includes context providers.
 * @param {Readonly<{ children: React.ReactNode }>} props - Props containing the children elements to render.
 * @returns {JSX.Element} The root layout structure for the application.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `suppressHydrationWarning` is often used with next-themes to avoid mismatches during initial render.
    <html lang="en" suppressHydrationWarning>
      {/* Applies the Geist Sans font variable and antialiasing for smoother text. */}
      <body className={`${geistSans.variable} antialiased`}>
        {/* ThemeProvider handles light/dark mode switching and persists the user's preference. */}
        <ThemeProvider
          attribute="class" // The HTML attribute to update (e.g., <html class="dark">).
          defaultTheme="system" // Default theme based on user's system preference.
          enableSystem // Allows the theme to follow system preference.
          disableTransitionOnChange // Prevents theme transitions on first load.
        >
          {/* AuthProvider manages Firebase authentication state and makes it available to the app. */}
          <AuthProvider>
            {children} {/* Renders the active page content. */}
            <Toaster /> {/* Global component for displaying toast notifications. */}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
