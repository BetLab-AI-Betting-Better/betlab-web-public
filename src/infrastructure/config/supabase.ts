/**
 * Supabase Configuration
 * Basé sur lib/core/config/supabase_config.dart
 */

export const SupabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
} as const;

// Validation
if (!SupabaseConfig.url || !SupabaseConfig.anonKey) {
  console.warn(
    'Supabase configuration is missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
  );
}
