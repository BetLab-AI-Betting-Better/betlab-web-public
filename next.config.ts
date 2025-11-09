import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Component caching conflicts with our dynamic match data (search params, auth)
  cacheComponents: false,
  reactCompiler: true,

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
    // Disable image optimization in development to avoid timeouts with slow external APIs
    unoptimized: process.env.NODE_ENV === 'development',
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

    // ✅ Server Actions configuration
    serverActions: {
      bodySizeLimit: '2mb',
    },

    turbopackFileSystemCacheForDev: true,
    // turbopackFileSystemCacheForBuild: true, // ⚠️ Requires Next.js canary
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // ✅ REMOVED: typescript.ignoreBuildErrors
  // Build will now fail on TypeScript errors - good for code quality!
};

export default nextConfig;
