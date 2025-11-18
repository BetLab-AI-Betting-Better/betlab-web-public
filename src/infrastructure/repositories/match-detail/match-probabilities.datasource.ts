import "server-only";
import { cache } from "react";
import type { ProbabilitiesResponse } from "@/core/entities/match-detail/probabilities.entity";
import { betlabFetch } from "@/infrastructure/services/betlab-api/client";

/**
 * Get match probabilities from BetLab API
 * Uses the /v1/matches/{match_id}/probabilities/internal endpoint
 *
 * Returns comprehensive probability data including:
 * - 1X2 probabilities
 * - BTTS (Both Teams To Score)
 * - Over/Under for multiple thresholds
 * - Top 10 most probable correct scores
 * - Model diagnostics
 */
export const getMatchProbabilities = cache(
  async (matchId: number | string): Promise<ProbabilitiesResponse | null> => {
    try {
      const data = await betlabFetch<ProbabilitiesResponse>(
        `/v1/matches/${matchId}/probabilities/internal`,
        {
          cache: "force-cache",
        }
      );

      return data;
    } catch (error) {
      const err = error as Error & { status?: number };

      // 404 = match not found or league not supported
      // 400 = league not supported (restricted to top European competitions)
      if (err.status === 404 || err.status === 400) {
        console.warn(
          `Probabilities not available for match ${matchId}:`,
          err.message
        );
        return null;
      }

      // For other errors, log and return null
      console.error(`Failed to fetch probabilities for match ${matchId}:`, error);
      return null;
    }
  }
);
