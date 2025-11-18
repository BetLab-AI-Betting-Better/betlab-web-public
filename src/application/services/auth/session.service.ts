import "server-only";

import { cache } from "react";
import type { CurrentUser } from "@/core/entities/user.entity";
import {
  createServerSupabaseClient,
  getCurrentSession,
} from "@/infrastructure/services/supabase/server-client";

const fetchOnboardingStatus = cache(async (userId: string): Promise<boolean> => {
  const supabase = createServerSupabaseClient();

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching onboarding status:", error);
      return true;
    }

    return profile?.onboarding_completed ?? false;
  } catch (error) {
    console.error("Unexpected onboarding status error:", error);
    return true;
  }
});

export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  return fetchOnboardingStatus(userId);
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await getCurrentSession();

  if (!session?.user) {
    return null;
  }

  const onboardingCompleted = await fetchOnboardingStatus(session.user.id);

  return {
    id: session.user.id,
    email: session.user.email ?? null,
    onboardingCompleted,
  };
});
