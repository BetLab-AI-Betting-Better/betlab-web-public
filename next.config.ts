import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration des images pour optimisation
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.sportsdata.io',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.api-football.com',
      },
      {
        protocol: 'https',
        hostname: 'media.api-sports.io',
      },
      {
        protocol: 'https',
        hostname: '**.media.api-sports.io',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 414, 768, 1024, 1440],
    imageSizes: [16, 32, 48, 64, 96],
    minimumCacheTTL: 60,
  },

  // Optimisations expérimentales
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'recharts',
      'date-fns',
      'framer-motion',
    ],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Désactiver TypeScript errors pendant le build pour tester optimisations
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
