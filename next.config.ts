
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
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
  devIndicators: false, //{
    //buildActivity: false, // Disable the build activity indicator (dots in corner)
  //},
  // It's generally not recommended to fully disable the Next.js development overlay
  // as it provides crucial error information.
  // If you must, you can try:
  // experimental: {
  //   devOverlay: false,
  // },
  // However, `buildActivity: false` is usually what users mean.
};

export default nextConfig;
