import "server-only";

import { cache } from "react";
import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity";
import type { PredictionType } from "@/core/entities/predictions/prediction.entity";
import type { IMatchDetailRepository } from "@/core/repositories/match-detail.repository";
import type { IPredictionRepository } from "@/core/repositories/prediction.repository";
import { betlabFetch } from "@/infrastructure/services/betlab-api/client";
import { getMatchProbabilities } from "./match-probabilities.datasource";
import { getMatchHtFtProbabilities } from "./match-htft.datasource";

interface ApiFixtureResponse {
  id: number;
  date: string;
  status: string;
  venue?: string;
  home_team: {
    id: number;
    name: string;
    logo: string;
  };
  away_team: {
    id: number;
    name: string;
    logo: string;
  };
  league: {
    id: number;
    name: string;
    season?: number;
    round?: string;
    logo?: string;
    country?: string;
  };
  goals?: {
    home: number | null;
    away: number | null;
  };
}

function transformMatchDetail(response: ApiFixtureResponse): MatchDetail {
  let mappedStatus: MatchDetail["status"] = "scheduled";
  if (["FT", "AET", "PEN"].includes(response.status)) {
    mappedStatus = "finished";
  } else if (["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(response.status)) {
    mappedStatus = "live";
  }

  return {
    id: response.id.toString(),
    fixtureId: response.id,
    homeTeam: {
      id: response.home_team.id,
      name: response.home_team.name,
      logo: response.home_team.logo,
    },
    awayTeam: {
      id: response.away_team.id,
      name: response.away_team.name,
      logo: response.away_team.logo,
    },
    league: {
      id: response.league.id,
      name: response.league.name,
      logo: response.league.logo ?? "",
      country: response.league.country ?? "",
    },
    kickoffTime: new Date(response.date),
    status: mappedStatus,
    score: response.goals
      ? {
          home: response.goals.home ?? 0,
          away: response.goals.away ?? 0,
        }
      : undefined,
    venue: response.venue,
  };
}

const fetchMatch = cache(async (fixtureId: number): Promise<MatchDetail> => {
  const data = await betlabFetch<ApiFixtureResponse>(`/api/fixtures/${fixtureId}`);
  return transformMatchDetail(data);
});

const DEFAULT_PREDICTION_TYPE: PredictionType = "match_result";

export class BetlabMatchDetailRepository implements IMatchDetailRepository {
  constructor(private readonly predictionRepository: IPredictionRepository) {}

  async getMatchDetail(fixtureId: number | string): Promise<MatchDetail> {
    const id = typeof fixtureId === "string" ? parseInt(fixtureId, 10) : fixtureId;
    const detail = await fetchMatch(id);

    await Promise.allSettled([
      this.attachPredictions(detail, id),
      this.attachProbabilities(detail, id),
      this.attachHtFtProbabilities(detail, id),
    ]);

    return detail;
  }

  async getLiveMatchDetail(fixtureId: number | string): Promise<MatchDetail> {
    const id = typeof fixtureId === "string" ? parseInt(fixtureId, 10) : fixtureId;
    return fetchMatch(id);
  }

  private async attachPredictions(detail: MatchDetail, fixtureId: number) {
    try {
      const prediction = await this.predictionRepository.getPrediction(
        fixtureId,
        DEFAULT_PREDICTION_TYPE
      );
      if (prediction) {
        detail.predictions = [prediction];
      }
    } catch (error) {
      console.warn(`Failed to fetch predictions for match ${fixtureId}:`, error);
    }
  }

  private async attachProbabilities(detail: MatchDetail, fixtureId: number) {
    try {
      const probabilities = await getMatchProbabilities(fixtureId);
      if (probabilities) {
        detail.probabilities = probabilities;
      }
    } catch (error) {
      console.warn(`Failed to fetch probabilities for match ${fixtureId}:`, error);
    }
  }

  private async attachHtFtProbabilities(detail: MatchDetail, fixtureId: number) {
    try {
      const htft = await getMatchHtFtProbabilities(fixtureId);
      if (htft) {
        detail.htFtProbabilities = htft;
      }
    } catch (error) {
      console.warn(`Failed to fetch HT-FT probabilities for match ${fixtureId}:`, error);
    }
  }
}
