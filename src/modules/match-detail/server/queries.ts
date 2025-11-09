import "server-only";
import { cache } from "react";
import { betlabFetch } from "@/infra/services/betlab-api/client";
import type { MatchDetail } from "../domain/types";
import { getPrediction, type PredictionType } from "@/modules/predictions/server/queries";
import { getMatchProbabilities } from "./probabilities-queries";

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
  score?: {
    halftime?: {
      home: number | null;
      away: number | null;
    };
    fulltime?: {
      home: number | null;
      away: number | null;
    };
  };
}

function transformMatchDetail(response: ApiFixtureResponse): MatchDetail {
  let mappedStatus: MatchDetail["status"] = "scheduled";
  if (["FT", "AET", "PEN"].includes(response.status)) {
    mappedStatus = "finished";
  } else if (["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(response.status)) {
    mappedStatus = "live";
  } else if (response.status === "NS") {
    mappedStatus = "scheduled";
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

export const getMatchDetail = cache(async (fixtureId: number | string): Promise<MatchDetail> => {
  const id = typeof fixtureId === "string" ? parseInt(fixtureId, 10) : fixtureId;

  const data = await betlabFetch<ApiFixtureResponse>(`/api/fixtures/${id}`);
  const matchDetail = transformMatchDetail(data);

  // Fetch predictions for the match (match_result by default)
  try {
    const prediction = await getPrediction(id, "match_result" as PredictionType);
    if (prediction) {
      matchDetail.predictions = [prediction];
    }
  } catch (error) {
    console.warn(`Failed to fetch predictions for match ${id}:`, error);
    // Continue without predictions
  }

  // Fetch probabilities from BetLab API
  try {
    const probabilities = await getMatchProbabilities(id);
    if (probabilities) {
      matchDetail.probabilities = probabilities;
    }
  } catch (error) {
    console.warn(`Failed to fetch probabilities for match ${id}:`, error);
    // Continue without probabilities
  }

  return matchDetail;
});

export const getLiveMatchDetail = cache(async (fixtureId: number | string): Promise<MatchDetail> => {
  const id = typeof fixtureId === "string" ? parseInt(fixtureId, 10) : fixtureId;

  const data = await betlabFetch<ApiFixtureResponse>(`/api/fixtures/${id}`);
  return transformMatchDetail(data);
});
