import "server-only";

import { cookies } from "next/headers";
import { connection } from "next/server";
import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";

import { env } from "@/core/config/env";

const ACCESS_TOKEN_COOKIE = "sb-access-token";
const REFRESH_TOKEN_COOKIE = "sb-refresh-token";

export function createServerSupabaseClient(): SupabaseClient {
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
    },
  });
}

export async function getSessionFromTokens(
  accessToken: string,
  refreshToken: string
): Promise<Session | null> {
  const supabase = createServerSupabaseClient();

  try {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      console.error("Error setting Supabase session:", error);
      return null;
    }

    return data.session;
  } catch (error) {
    console.error("Unexpected Supabase session error:", error);
    return null;
  }
}

export async function getServerSupabaseSessionClient() {
  await connection(); // Mark route as dynamic before accessing cookies
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!accessToken || !refreshToken) {
    return { supabase: null, session: null };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    console.error("Error creating Supabase session client:", error);
    return { supabase: null, session: null };
  }

  return { supabase, session: data.session };
}

export async function getCurrentSession(): Promise<Session | null> {
  await connection(); // Mark route as dynamic before accessing cookies
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!accessToken || !refreshToken) {
    return null;
  }

  return getSessionFromTokens(accessToken, refreshToken);
}
