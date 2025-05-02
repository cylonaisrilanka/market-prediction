import type {Metadata} from 'next';
import { Geist } from 'next/font/google'; // Removed Geist_Mono as it's not used
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider'; // Import the new client component

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// Removed geistMono as it's not used

export const metadata: Metadata = {
  title: 'FashionFlow AI', // Updated title for consistency
  description: 'Predict the market trends for your fashion designs using AI.', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* Add suppressHydrationWarning for next-themes */}
      <body className={`${geistSans.variable} antialiased`}> {/* Removed geistMono variable */}
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
