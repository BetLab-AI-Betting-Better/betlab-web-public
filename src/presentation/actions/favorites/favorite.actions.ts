"use server";

import "server-only";
import { updateTag } from "next/cache";
import { FAVORITES_CACHE } from "@/shared/constants/cache/favorites.cache";
import type { FavoriteActionResult } from "@/core/entities/favorites/favorite.entity";
import { container } from "@/presentation/di/container";

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
    const favoritesService = container.createFavoritesService();
    const alreadyFavorited = await favoritesService.isFavorited(userId, fixtureId);

    if (alreadyFavorited) {
      return { success: true };
    }

    await favoritesService.toggleFavorite(userId, fixtureId, false);

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
    const favoritesService = container.createFavoritesService();
    const alreadyFavorited = await favoritesService.isFavorited(userId, fixtureId);

    if (!alreadyFavorited) {
      return { success: true };
    }

    await favoritesService.toggleFavorite(userId, fixtureId, true);

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
  try {
    const favoritesService = container.createFavoritesService();
    await favoritesService.toggleFavorite(userId, fixtureId, currentlyFavorited);
    updateTag(FAVORITES_CACHE.tags.byUser(userId));
    return { success: true };
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return { success: false, error: "An error occurred" };
  }
}
