import "server-only";

import { cache } from "react";
import type {
  PredictionData,
  PredictionType,
} from "@/core/entities/predictions/prediction.entity";
import type { IPredictionRepository } from "@/core/repositories/prediction.repository";
import {
  transform1X2ToPrediction,
  transformMarketsToOverUnder,
  transformMarketsToBTTS,
  transformMarketsToCorrectScore,
  transformMarketsToDrawNoBet,
  transformMarketsToAsianHandicap,
  transformMarketsToAsianTotals,
  transformMarketsToExactGoals,
  transformMarketsToDoubleChance,
  transformMarketsToCorners,
  transformMarketsToEuropeanHandicap,
  type API1X2Response,
  type APIMarketsResponse,
  type APIOddsResponse,
} from "@/application/mappers/prediction.mapper";
import { betlabFetch } from "@/infrastructure/services/betlab-api/client";

type PredictionEndpoint = "1x2" | "markets";

function getEndpointForType(type: PredictionType): PredictionEndpoint {
  return type === "match_result" ? "1x2" : "markets";
}

async function fetchPrediction(
  fixtureId: number,
  type: PredictionType
): Promise<PredictionData | null> {
  const endpoint = getEndpointForType(type);

  const [predictionResponse, oddsResponse] = await Promise.allSettled([
    endpoint === "1x2"
      ? betlabFetch<API1X2Response>(`/v1/matches/${fixtureId}/probabilities/1x2`)
      : betlabFetch<
        APIMarketsResponse,
        { model: string; cap: number; include_scores_top: number }
      >(`/v1/matches/${fixtureId}/probabilities/markets`, {
        method: "POST",
        body: {
          model: "poisson",
          cap: 10,
          include_scores_top: 10,
        },
      }),
    betlabFetch<APIOddsResponse>(`/v1/matches/${fixtureId}/odds`),
  ]);

  if (predictionResponse.status === "rejected") {
    const error = predictionResponse.reason as Error & { status?: number };

    if (error?.status === 404) {
      return null;
    }

    throw error;
  }

  const predictionData = predictionResponse.value;
  const odds = oddsResponse.status === "fulfilled" ? oddsResponse.value : null;

  switch (type) {
    case "match_result":
      return transform1X2ToPrediction(predictionData as API1X2Response, odds, fixtureId);
    case "over_under":
      return transformMarketsToOverUnder(predictionData as APIMarketsResponse, odds, fixtureId);
    case "both_teams_score":
      return transformMarketsToBTTS(predictionData as APIMarketsResponse, odds, fixtureId);
    case "correct_score":
      return transformMarketsToCorrectScore(predictionData as APIMarketsResponse, fixtureId);
    case "draw_no_bet":
      return transformMarketsToDrawNoBet(predictionData as APIMarketsResponse, odds, fixtureId);
    case "asian_handicap":
      return transformMarketsToAsianHandicap(predictionData as APIMarketsResponse, odds, fixtureId);
    case "asian_totals":
      return transformMarketsToAsianTotals(predictionData as APIMarketsResponse, odds, fixtureId);
    case "exact_goals":
      return transformMarketsToExactGoals(predictionData as APIMarketsResponse, fixtureId);
    case "double_chance":
      return transformMarketsToDoubleChance(predictionData as APIMarketsResponse, fixtureId);
    case "corners":
      return transformMarketsToCorners(predictionData as APIMarketsResponse, fixtureId);
    case "european_handicap":
      return transformMarketsToEuropeanHandicap(predictionData as APIMarketsResponse, fixtureId);
    case "half_time":
    case "first_goal": {
      console.warn(
        `Prediction type "${type}" not implemented. Falling back to match_result transformation.`
      );

      if (endpoint === "1x2") {
        return transform1X2ToPrediction(predictionData as API1X2Response, odds, fixtureId);
      }

      const marketsPredictions = predictionData as APIMarketsResponse;
      const fallback: API1X2Response = {
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

      return transform1X2ToPrediction(fallback, odds, fixtureId);
    }
    default:
      throw new Error(`Unknown prediction type: ${type satisfies never}`);
  }
}

const cachedPrediction = cache(fetchPrediction);

export class BetlabPredictionRepository implements IPredictionRepository {
  async getPrediction(
    fixtureId: number,
    type: PredictionType
  ): Promise<PredictionData | null> {
    return cachedPrediction(fixtureId, type);
  }

  async getPredictions(
    fixtureIds: number[],
    type: PredictionType
  ): Promise<PredictionData[]> {
    if (fixtureIds.length === 0) {
      return [];
    }

    const limitedIds = fixtureIds.slice(0, 50);
    const results = await Promise.allSettled(
      limitedIds.map((fixtureId) => this.getPrediction(fixtureId, type))
    );

    return results
      .filter(
        (result): result is PromiseFulfilledResult<PredictionData> =>
          result.status === "fulfilled" && Boolean(result.value)
      )
      .map((result) => result.value);
  }
}
