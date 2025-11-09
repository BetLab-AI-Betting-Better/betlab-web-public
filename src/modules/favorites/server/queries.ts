import "server-only";
import { cache } from "react";
import { createServerSupabaseClient } from "@/infra/services/supabase/server-client";

/**
 * Get user favorites with caching
 * @param userId - User ID
 * @returns Array of favorite fixture IDs
 */
export const getUserFavorites = cache(async (userId: string): Promise<number[]> => {
  try {
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
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    return [];
  }
});

/**
 * Check if a fixture is favorited by user
 * @param userId - User ID
 * @param fixtureId - Fixture ID
 * @returns True if favorited
 */
export const isFixtureFavorited = cache(
  async (userId: string, fixtureId: number): Promise<boolean> => {
    try {
      const supabase = await createServerSupabaseClient();

      const { data, error } = await supabase
        .from("user_favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("fixture_id", fixtureId)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        console.error("Failed to check favorite:", error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error("Error checking favorite:", error);
      return false;
    }
  }
);
