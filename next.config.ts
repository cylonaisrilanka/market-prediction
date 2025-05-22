
import type {NextConfig} from 'next';

/**
 * @type {NextConfig}
 * Next.js configuration options.
 */
const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    /**
     * If true, Next.js will not fail the build if there are TypeScript errors.
     * Recommended to keep false for production to catch type errors.
     */
    ignoreBuildErrors: true,
  },
  eslint: {
    /**
     * If true, Next.js will not fail the build if there are ESLint errors.
     * Recommended to keep false for production to enforce code quality.
     */
    ignoreDuringBuilds: true,
  },
  images: {
    /**
     * Configuration for Next.js Image Optimization.
     * Defines a list of remote patterns (domains) from which images can be optimized.
     */
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co', // Added placehold.co for placeholder images
        port: '',
        pathname: '/**',
      },
       { // Keep existing picsum.photos if still needed, or remove if not
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  /**
   * Development indicators configuration.
   * `buildActivity` shows a small indicator in the corner during development builds.
   * Setting to false disables this indicator.
   */
  devIndicators: {
    buildActivity: false,
  }
  // It's generally not recommended to fully disable the Next.js development overlay
  // as it provides crucial error information.
  // If you must, you can try:
  // experimental: {
  //   devOverlay: false,
  // },
  // However, `devIndicators: { buildActivity: false }` is usually what users mean
  // when wanting to reduce visual clutter during development.
};

export default nextConfig;
