import "server-only";

import { cache } from "react";
import type { IFavoriteRepository } from "@/core/repositories/favorite.repository";
import { createServerSupabaseClient } from "@/infrastructure/services/supabase/server-client";

const cachedUserFavorites = cache(async (userId: string): Promise<number[]> => {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("user_favorites")
    .select("fixture_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch favorites:", error);
    return [];
  }

  return data?.map((fav) => fav.fixture_id) ?? [];
});

const cachedIsFavorited = cache(
  async (userId: string, fixtureId: number): Promise<boolean> => {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("fixture_id", fixtureId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Failed to check favorite:", error);
      return false;
    }

    return Boolean(data);
  }
);

export class SupabaseFavoriteRepository implements IFavoriteRepository {
  async listByUser(userId: string): Promise<number[]> {
    return cachedUserFavorites(userId);
  }

  async isFavorited(userId: string, fixtureId: number): Promise<boolean> {
    return cachedIsFavorited(userId, fixtureId);
  }

  async add(userId: string, fixtureId: number): Promise<void> {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("user_favorites").insert({
      user_id: userId,
      fixture_id: fixtureId,
      created_at: new Date().toISOString(),
    });

    if (error) {
      throw error;
    }
  }

  async remove(userId: string, fixtureId: number): Promise<void> {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", userId)
      .eq("fixture_id", fixtureId);

    if (error) {
      throw error;
    }
  }
}
