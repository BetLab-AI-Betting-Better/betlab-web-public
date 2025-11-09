"use server";

import "server-only";
import { updateTag } from "next/cache";
import { createServerSupabaseClient } from "@/infra/services/supabase/server-client";
import { FAVORITES_CACHE } from "../cache/profile";
import type { FavoriteActionResult } from "../domain/types";

/**
 * Add a fixture to user's favorites
 * @param userId - User ID
 * @param fixtureId - Fixture ID
 * @returns Result with success status
 */
export async function addFavoriteAction(
  userId: string,
  fixtureId: number
): Promise<FavoriteActionResult> {
  try {
    const supabase = await createServerSupabaseClient();

    // Check if already favorited
    const { data: existing } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("fixture_id", fixtureId)
      .single();

    if (existing) {
      return { success: true }; // Already favorited
    }

    // Insert new favorite
    const { error } = await supabase.from("user_favorites").insert({
      user_id: userId,
      fixture_id: fixtureId,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Failed to add favorite:", error);
      return { success: false, error: "Failed to add favorite" };
    }

    // Invalidate cache
    updateTag(FAVORITES_CACHE.tags.byUser(userId));

    console.log(`✅ Added favorite: fixture ${fixtureId} for user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding favorite:", error);
    return { success: false, error: "An error occurred" };
  }
}

/**
 * Remove a fixture from user's favorites
 * @param userId - User ID
 * @param fixtureId - Fixture ID
 * @returns Result with success status
 */
export async function removeFavoriteAction(
  userId: string,
  fixtureId: number
): Promise<FavoriteActionResult> {
  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", userId)
      .eq("fixture_id", fixtureId);

    if (error) {
      console.error("Failed to remove favorite:", error);
      return { success: false, error: "Failed to remove favorite" };
    }

    // Invalidate cache
    updateTag(FAVORITES_CACHE.tags.byUser(userId));

    console.log(`✅ Removed favorite: fixture ${fixtureId} for user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Error removing favorite:", error);
    return { success: false, error: "An error occurred" };
  }
}

/**
 * Toggle a fixture favorite status
 * @param userId - User ID
 * @param fixtureId - Fixture ID
 * @param currentlyFavorited - Current favorite status
 * @returns Result with success status
 */
export async function toggleFavoriteAction(
  userId: string,
  fixtureId: number,
  currentlyFavorited: boolean
): Promise<FavoriteActionResult> {
  if (currentlyFavorited) {
    return removeFavoriteAction(userId, fixtureId);
  } else {
    return addFavoriteAction(userId, fixtureId);
  }
}
