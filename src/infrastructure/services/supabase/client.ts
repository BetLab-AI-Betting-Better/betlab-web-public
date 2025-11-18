/**
 * Supabase Service
 * Basé sur lib/core/services/supabase_service.dart
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '@/infrastructure/config/supabase';

let supabaseClientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  // Lazy initialization - only create client when first requested
  if (!supabaseClientInstance) {
    if (!SupabaseConfig.url || !SupabaseConfig.anonKey) {
      throw new Error(
        'Supabase client not initialized. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
      );
    }

    supabaseClientInstance = createClient(SupabaseConfig.url, SupabaseConfig.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return supabaseClientInstance;
}

export function isSupabaseInitialized(): boolean {
  return !!SupabaseConfig.url && !!SupabaseConfig.anonKey;
}
