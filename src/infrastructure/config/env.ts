/**
 * Environment Configuration
 * Centralized, type-safe environment variables using Zod validation
 *
 * This replaces the previous typeof window checks and provides compile-time safety
 */

import { z } from 'zod';

const envSchema = z.object({
  // API Configuration
  NEXT_PUBLIC_API_BASE_URL: z.string().url({
    message: 'NEXT_PUBLIC_API_BASE_URL must be a valid URL',
  }),

  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url({
    message: 'NEXT_PUBLIC_SUPABASE_URL must be a valid URL',
  }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, {
    message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required',
  }),

  // Optional: Add other environment variables as needed
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Parse and validate environment variables
// This will throw an error at build time if any required variables are missing or invalid
function parseEnv() {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NODE_ENV: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Invalid environment variables');
  }
}

export const env = parseEnv();

// Type export for use in other files
export type Env = z.infer<typeof envSchema>;
