import "server-only";
import { cache } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { headers } from "next/headers";
import { betlabFetch } from "@/infra/services/betlab-api/client";
import {
  getPrediction,
  type PredictionType,
  type PredictionData,
} from "@/modules/predictions/server/queries";
import { promiseBatch } from "@/shared/utils";
import { FIXTURES_CACHE } from "../cache/profile";
import type { Match, MatchWithPrediction } from "../domain/types";

interface ApiFixtureResponse {
  fixture?: {
    id: number;
    date: string;
    status?: {
      short: string;
    };
  };
  teams?: {
    home?: {
      id: number;
      name: string;
      logo: string;
    };
    away?: {
      id: number;
      name: string;
      logo: string;
    };
  };
  league?: {
    id: number;
    name: string;
    logo: string;
    country: string;
  };
  goals?: {
    home: number | null;
    away: number | null;
  };
}

function transformFixture(item: ApiFixtureResponse): Match {
  const fixtureId = item.fixture?.id ?? 0;
  const status = item.fixture?.status?.short ?? "NS";

  let mappedStatus: Match["status"] = "scheduled";
  if (["FT", "AET", "PEN"].includes(status)) {
    mappedStatus = "finished";
  } else if (["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(status)) {
    mappedStatus = "live";
  }

  return {
    id: `${fixtureId}`,
    fixtureId,
    homeTeam: {
      id: item.teams?.home?.id ?? 0,
      name: item.teams?.home?.name ?? "Unknown",
      logo: item.teams?.home?.logo ?? "",
    },
    awayTeam: {
      id: item.teams?.away?.id ?? 0,
      name: item.teams?.away?.name ?? "Unknown",
      logo: item.teams?.away?.logo ?? "",
    },
    league: {
      id: item.league?.id ?? 0,
      name: item.league?.name ?? "Unknown",
      logo: item.league?.logo ?? "",
      country: item.league?.country ?? "",
    },
    kickoffTime: new Date(item.fixture?.date ?? Date.now()),
    status: mappedStatus,
    score: item.goals
      ? {
          home: item.goals.home ?? 0,
          away: item.goals.away ?? 0,
        }
      : undefined,
  };
}

export const getFixtures = cache(async (date: string): Promise<Match[]> => {
  'use cache';
  cacheTag(FIXTURES_CACHE.tags.byDate(date));
  cacheLife(FIXTURES_CACHE.life.byDate);

  // Disable Next.js fetch cache as response is > 2MB
  // Cache is handled by 'use cache' directive instead
  const data = await betlabFetch<ApiFixtureResponse[]>("/api/fixtures", {
    searchParams: { date },
    cache: 'no-store',
  });
  return data.map(transformFixture);
});

export const getLiveFixtures = cache(async (): Promise<Match[]> => {
  'use cache';
  cacheTag(FIXTURES_CACHE.tags.live());
  cacheLife(FIXTURES_CACHE.life.live);

  // Disable Next.js fetch cache as response might be > 2MB
  // Cache is handled by 'use cache' directive instead
  const data = await betlabFetch<ApiFixtureResponse[]>("/api/fixtures/live", {
    cache: 'no-store',
  });
  return data.map(transformFixture);
});

export async function getTodayFixtures(date: Date = new Date()): Promise<Match[]> {
  const today = date.toISOString().split("T")[0];
  return getFixtures(today);
}

export const getTodayFixturesWithPredictions = async (options?: {
  date?: Date;
  type?: PredictionType;
}): Promise<MatchWithPrediction[]> => {
  // Force dynamic rendering by accessing headers
  await headers();

  const date = options?.date ?? new Date();
  const predictionType = options?.type ?? "match_result";

  const matches = await getTodayFixtures(date);

  if (matches.length === 0) {
    return matches;
  }

  // Fetch predictions in batches to avoid overwhelming the API
  // Max 5 concurrent requests to prevent 429 Rate Limit errors
  // Only successful predictions will be cached (getPrediction uses 'use cache')
  const predictionsResults = await promiseBatch(
    matches,
    (match) => getPrediction(match.fixtureId, predictionType),
    5 // Max 5 concurrent requests
  );

  return matches.map((match, index) => {
    const result = predictionsResults[index];
    const prediction = result.status === "fulfilled" ? result.value : null;

    return {
      ...match,
      prediction,
    };
  });
};
