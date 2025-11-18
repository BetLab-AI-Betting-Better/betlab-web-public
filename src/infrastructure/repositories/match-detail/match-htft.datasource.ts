import "server-only"

import { cache } from "react"
import type { HtFtProbabilitiesResponse } from "@/core/entities/match-detail/ht-ft.entity"
import { betlabFetch } from "@/infrastructure/services/betlab-api/client"

/**
 * Fetch HT-FT probabilities for a match
 */
export const getMatchHtFtProbabilities = cache(
  async (matchId: number | string): Promise<HtFtProbabilitiesResponse | null> => {
    try {
      return await betlabFetch<HtFtProbabilitiesResponse>(
        `/v1/matches/${matchId}/probabilities/ht-ft`,
        { cache: "force-cache" }
      )
    } catch (error) {
      const err = error as Error & { status?: number }

      if (err.status === 404 || err.status === 400) {
        console.warn(
          `HT-FT probabilities not available for match ${matchId}:`,
          err.message
        )
        return null
      }

      console.error(`Failed to fetch HT-FT probabilities for match ${matchId}:`, error)
      return null
    }
  }
)
