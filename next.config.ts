import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components align with Next.js 16 recommendations
  cacheComponents: true,
  cacheLife: {
    default: { stale: 60, revalidate: 300, expire: 3600 },
    short: { stale: 10, revalidate: 60, expire: 300 },
    long: { stale: 300, revalidate: 3600, expire: 86400 },
  },
  reactCompiler: true,

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

  experimental: {
    turbopackFileSystemCache: {
      dev: true,
      build: true,
    },
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
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  turbopack: {
    resolveAlias: {
      '@': './src',
      '@components': './src/presentation/components',
      '@core': './src/core',
      '@domain': './src/core',
      '@infrastructure': './src/infrastructure',
      '@application': './src/application',
      '@presentation': './src/presentation',
    },
  },
};

export default nextConfig;
