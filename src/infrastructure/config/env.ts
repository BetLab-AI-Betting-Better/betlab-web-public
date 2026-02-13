/**
 * Environment Configuration
 * Centralized, type-safe environment variables using Zod validation
 *
 * This replaces the previous typeof window checks and provides compile-time safety
 */

import { z } from 'zod';

const envSchema = z.object({
  // API Configuration
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url({
      message: 'NEXT_PUBLIC_API_BASE_URL must be a valid URL',
    })
    .optional(),

  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url({
      message: 'NEXT_PUBLIC_SUPABASE_URL must be a valid URL',
    })
    .optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, {
      message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required',
    })
    .optional(),

  // Optional: Add other environment variables as needed
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Parse and validate environment variables
// Non-blocking validation: warn on invalid values but never crash the build.
function parseEnv() {
  const raw = {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NODE_ENV: process.env.NODE_ENV,
  };

  const parsed = envSchema.safeParse(raw);
  if (!parsed.success) {
    console.warn('⚠️ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  }

  const data: Partial<z.infer<typeof envSchema>> = parsed.success ? parsed.data : {};
  const apiFallback =
    raw.NEXT_PUBLIC_API_BASE_URL ||
    'https://fastapi-production-2b94.up.railway.app';

  const resolved = {
    NEXT_PUBLIC_API_BASE_URL: data.NEXT_PUBLIC_API_BASE_URL ?? apiFallback,
    NEXT_PUBLIC_SUPABASE_URL: data.NEXT_PUBLIC_SUPABASE_URL ?? '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: data.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    NODE_ENV:
      data.NODE_ENV ??
      (raw.NODE_ENV as 'development' | 'production' | 'test' | undefined) ??
      'development',
  };

  if (!resolved.NEXT_PUBLIC_SUPABASE_URL || !resolved.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn(
      '⚠️ Supabase env missing. Favorites/auth features will be disabled.'
    );
  }

  return resolved;
}

export const env = parseEnv();

// Type export for use in other files
export type Env = z.infer<typeof envSchema>;
