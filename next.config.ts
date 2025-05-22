
import type {NextConfig} from 'next';

/**
 * @fileOverview Next.js configuration file.
 * This file defines various settings for the Next.js application,
 * including TypeScript and ESLint error handling, image optimization,
 * and development server indicators.
 */

/**
 * @type {NextConfig}
 * Next.js configuration options.
 */
const nextConfig: NextConfig = {
  /* config options here */

  /**
   * TypeScript configuration for the build process.
   */
  typescript: {
    /**
     * If true, Next.js will not fail the build if there are TypeScript errors.
     * Recommended to keep false for production to catch type errors early.
     * Set to true here, presumably for development ease or specific project needs.
     */
    ignoreBuildErrors: true,
  },

  /**
   * ESLint configuration for the build process.
   */
  eslint: {
    /**
     * If true, Next.js will not fail the build if there are ESLint errors.
     * Recommended to keep false for production to enforce code quality.
     * Set to true here, presumably for development ease or specific project needs.
     */
    ignoreDuringBuilds: true,
  },

  /**
   * Configuration for Next.js Image Optimization (next/image component).
   */
  images: {
    /**
     * Defines a list of remote patterns (domains) from which images can be optimized.
     * This is a security measure to prevent arbitrary image optimization from unknown sources.
     */
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co', // Allows images from placehold.co for placeholder images.
        port: '',
        pathname: '/**', // Allows any path under this hostname.
      },
       {
        // Keep existing picsum.photos configuration if still needed for other placeholders,
        // or remove if only placehold.co is used.
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },

  /**
   * Configuration for development-specific indicators.
   */
  devIndicators: {
    /**
     * `buildActivity` shows a small indicator in the browser corner during development builds.
     * Setting to false disables this indicator, which can reduce visual clutter.
     */
    buildActivity: false,
  }
  // It's generally not recommended to fully disable the Next.js development overlay
  // as it provides crucial error information during development.
  // If you must, you can try:
  // experimental: {
  //   devOverlay: false,
  // },
  // However, `devIndicators: { buildActivity: false }` is usually what users mean
  // when wanting to reduce visual clutter during development.
};

export default nextConfig;
