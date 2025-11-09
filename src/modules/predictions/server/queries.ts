import "server-only";
import { cache } from "react";
import { betlabFetch } from "@/infra/services/betlab-api/client";
import {
  transform1X2ToPrediction,
  transformMarketsToOverUnder,
  transformMarketsToBTTS,
  transformMarketsToCorrectScore,
  transformMarketsToDrawNoBet,
  transformMarketsToAsianHandicap,
  transformMarketsToDoubleChance,
  type PredictionData,
  type API1X2Response,
  type APIMarketsResponse,
  type APIOddsResponse,
} from "@/shared/hooks/use-predictions-transforms";

export type PredictionType =
  | "match_result"
  | "over_under"
  | "both_teams_score"
  | "correct_score"
  | "double_chance"
  | "draw_no_bet"
  | "asian_handicap"
  | "half_time"
  | "corners"
  | "first_goal";

function getEndpointForType(type: PredictionType): "1x2" | "markets" {
  return type === "match_result" ? "1x2" : "markets";
}

async function fetchSinglePrediction(
  fixtureId: number,
  type: PredictionType
): Promise<PredictionData | null> {
  const endpoint = getEndpointForType(type);

  try {
    const [predictionResponse, oddsResponse] = await Promise.allSettled([
      endpoint === "1x2"
        ? betlabFetch<API1X2Response>(`/v1/matches/${fixtureId}/probabilities/1x2`)
        : betlabFetch<APIMarketsResponse, { model: string; cap: number; include_scores_top: number }>(
            `/v1/matches/${fixtureId}/probabilities/markets`,
            {
              method: "POST",
              body: {
                model: "poisson",
                cap: 10,
                include_scores_top: 10,
              },
            }
          ),
      betlabFetch<APIOddsResponse>(`/v1/matches/${fixtureId}/odds`),
    ]);

    if (predictionResponse.status === "rejected") {
      const error = predictionResponse.reason as Error & { status?: number };

      // 404 = no prediction data available for this match (expected, can be cached as null)
      if (error?.status === 404) {
        return null;
      }

      // Other errors (500, network, etc.) should be thrown to prevent caching
      // This allows retries on subsequent requests
      throw error;
    }

    const predictions = predictionResponse.value;

    const odds = oddsResponse.status === "fulfilled" ? oddsResponse.value : null;

    switch (type) {
      case "match_result":
        return transform1X2ToPrediction(predictions as API1X2Response, odds, fixtureId);
      case "over_under":
        return transformMarketsToOverUnder(predictions as APIMarketsResponse, odds, fixtureId);
      case "both_teams_score":
        return transformMarketsToBTTS(predictions as APIMarketsResponse, odds, fixtureId);
      case "correct_score":
        return transformMarketsToCorrectScore(predictions as APIMarketsResponse, fixtureId);
      case "draw_no_bet":
        return transformMarketsToDrawNoBet(predictions as APIMarketsResponse, odds, fixtureId);
      case "asian_handicap":
        return transformMarketsToAsianHandicap(predictions as APIMarketsResponse, odds, fixtureId);
      case "double_chance":
        return transformMarketsToDoubleChance(predictions as APIMarketsResponse, fixtureId);
      case "half_time":
      case "corners":
      case "first_goal":
        console.warn(
          `Prediction type "${type}" not yet implemented, falling back to match_result`
        );
        if (endpoint === "1x2") {
          return transform1X2ToPrediction(predictions as API1X2Response, odds, fixtureId);
        }
        const marketsPredictions = predictions as APIMarketsResponse;
        const fake1x2: API1X2Response = {
          generated_at: new Date().toISOString(),
          model_version: "ensemble-1.0.0",
          inputs: {
            match_id: String(fixtureId),
            home_team: "",
            away_team: "",
            kickoff_utc: null,
            mu_home: marketsPredictions.inputs.mu_home,
            mu_away: marketsPredictions.inputs.mu_away,
          },
          markets: marketsPredictions.oneXtwo,
          implied_odds: {
            home: 1 / marketsPredictions.oneXtwo.home,
            draw: 1 / marketsPredictions.oneXtwo.draw,
            away: 1 / marketsPredictions.oneXtwo.away,
          },
        };
        return transform1X2ToPrediction(fake1x2, odds, fixtureId);
      default:
        throw new Error(`Unknown prediction type: ${type}`);
    }
  } catch (error) {
    // Re-throw errors to prevent caching failures
    // This allows Next.js to retry on subsequent requests
    throw error;
  }
}

export const getPredictions = async (
  fixtureIds: number[],
  type: PredictionType
): Promise<PredictionData[]> => {
  if (fixtureIds.length === 0) return [];

  const matchIds = fixtureIds.slice(0, 50);

  try {
    const predictions = await Promise.allSettled(
      matchIds.map((fixtureId) => fetchSinglePrediction(fixtureId, type))
    );

    return predictions
      .filter(
        (result): result is PromiseFulfilledResult<PredictionData> =>
          result.status === "fulfilled" && result.value !== null
      )
      .map((result) => result.value);
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return [];
  }
};

export const getPrediction = cache(
  async (fixtureId: number, type: PredictionType): Promise<PredictionData | null> => {
    return fetchSinglePrediction(fixtureId, type);
  }
);

export type { PredictionData };
