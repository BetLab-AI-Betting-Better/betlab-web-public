"use server";

import "server-only";
import { revalidatePath, updateTag } from "next/cache";
import { getServerSupabaseSessionClient } from "@/infrastructure/services/supabase/server-client";
import { ONBOARDING_CACHE } from "@/shared/constants/cache/onboarding.cache";

export type RiskProfile = "conservative" | "balanced" | "aggressive" | null;

export interface CompleteOnboardingInput {
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  selectedLeagues: string[];
  selectedPredictionTypes: string[];
  riskProfile: RiskProfile;
}

export async function completeOnboardingAction(payload: CompleteOnboardingInput) {
  const { supabase, session } = await getServerSupabaseSessionClient();

  if (!supabase || !session?.user) {
    return { success: false, error: "Utilisateur non authentifié" };
  }

  const profileUpdate = {
    id: session.user.id,
    user_id: session.user.id,
    first_name: payload.firstName,
    last_name: payload.lastName,
    avatar_url: payload.avatarUrl ?? null,
    favorite_leagues: payload.selectedLeagues,
    prediction_types: payload.selectedPredictionTypes,
    risk_profile: payload.riskProfile,
    onboarding_completed: true,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("profiles").upsert(profileUpdate);

  if (error) {
    console.error("Error saving onboarding data:", error);
    return { success: false, error: "Impossible d'enregistrer vos préférences" };
  }

  updateTag(ONBOARDING_CACHE.tags.profile(session.user.id));
  updateTag(ONBOARDING_CACHE.tags.onboarding(session.user.id));
  revalidatePath("/", "page");

  return { success: true };
}
