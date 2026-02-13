import "server-only";

import { cache } from "react";
import type { Match, MatchWithPrediction } from "@/core/entities/fixtures/fixture.entity";
import type { PredictionData } from "@/core/entities/predictions/prediction.entity";
import type { IFixtureRepository } from "@/core/repositories/fixture.repository";
import { betlabFetch } from "@/infrastructure/services/betlab-api/client";
import { transform1X2ToPrediction, type API1X2Response } from "@/application/mappers/prediction.mapper";

interface ApiFixtureResponse {
  fixture?: {
    id: number;
    date: string;
    status?: {
      short: string;
      elapsed?: number;
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
  score?: {
    halftime?: {
      home: number | null;
      away: number | null;
    };
    fulltime?: {
      home: number | null;
      away: number | null;
    };
    extratime?: {
      home: number | null;
      away: number | null;
    };
    penalty?: {
      home: number | null;
      away: number | null;
    };
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
        halftime: item.score?.halftime && item.score.halftime.home !== null && item.score.halftime.away !== null
          ? {
            home: item.score.halftime.home,
            away: item.score.halftime.away,
          }
          : undefined,
      }
      : undefined,
    elapsed: item.fixture?.status?.elapsed,
  };
}

const fetchFixtures = cache(async (date: string): Promise<Match[]> => {
  const data = await betlabFetch<ApiFixtureResponse[]>("/api/fixtures", {
    searchParams: { date },
    cache: "no-store",
  });
  return data.map(transformFixture);
});

const fetchLiveFixtures = cache(async (): Promise<Match[]> => {
  const data = await betlabFetch<ApiFixtureResponse[]>("/api/fixtures/live", {
    cache: "no-store",
  });
  return data.map(transformFixture);
});

/**
 * Web-optimized endpoint response (from /v1/web/matches/daily)
 * Returns fixtures with predictions pre-loaded in one call
 */
interface WebDailyMatchesResponse {
  date: string;
  count: number;
  matches: unknown[];
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function normalizeProbability(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  if (value > 1) return Math.min(1, Math.max(0, value / 100));
  return Math.min(1, Math.max(0, value));
}

function normalizePrediction(rawPrediction: unknown, fixtureId: number): PredictionData | undefined {
  const prediction = asRecord(rawPrediction);
  if (!prediction) return undefined;

  // Backend may send a raw 1X2 payload (with or without `type`)
  if (prediction.inputs && prediction.markets && prediction.implied_odds) {
    try {
      return transform1X2ToPrediction(prediction as unknown as API1X2Response, null, fixtureId);
    } catch {
      // Fall through to generic parsing.
    }
  }

  if (prediction.type !== "match_result") {
    return prediction as unknown as PredictionData;
  }

  const homeProbability = normalizeProbability((prediction.homeWin as { probability?: unknown } | undefined)?.probability);
  const drawProbability = normalizeProbability((prediction.draw as { probability?: unknown } | undefined)?.probability);
  const awayProbability = normalizeProbability((prediction.awayWin as { probability?: unknown } | undefined)?.probability);

  const cloned = structuredClone(prediction) as Record<string, unknown>;
  if (homeProbability !== undefined && typeof cloned.homeWin === "object" && cloned.homeWin) {
    (cloned.homeWin as { probability?: number }).probability = homeProbability;
  }
  if (drawProbability !== undefined && typeof cloned.draw === "object" && cloned.draw) {
    (cloned.draw as { probability?: number }).probability = drawProbability;
  }
  if (awayProbability !== undefined && typeof cloned.awayWin === "object" && cloned.awayWin) {
    (cloned.awayWin as { probability?: number }).probability = awayProbability;
  }

  if (typeof cloned.best_market === "object" && cloned.best_market) {
    const bestMarket = cloned.best_market as { prob?: unknown; probability?: unknown };
    const normalizedBest = normalizeProbability(bestMarket.probability ?? bestMarket.prob);
    if (normalizedBest !== undefined) {
      bestMarket.prob = normalizedBest;
      bestMarket.probability = normalizedBest;
    }
  }

  if (typeof cloned.analytics === "object" && cloned.analytics && Array.isArray((cloned.analytics as { opportunities?: unknown[] }).opportunities)) {
    (cloned.analytics as { opportunities: Array<{ prob?: number }> }).opportunities = (cloned.analytics as { opportunities: Array<{ prob?: unknown }> }).opportunities.map((item) => ({
      ...item,
      prob: normalizeProbability(item.prob) ?? 0,
    }));
  }

  return cloned as unknown as PredictionData;
}

function normalizeTeam(rawTeam: unknown): MatchWithPrediction["homeTeam"] {
  const team = asRecord(rawTeam);
  return {
    id: toNumber(team?.id) ?? 0,
    name: typeof team?.name === "string" ? team.name : "Unknown",
    logo: typeof team?.logo === "string" ? team.logo : "",
  };
}

function normalizeLeague(rawLeague: unknown): MatchWithPrediction["league"] {
  const league = asRecord(rawLeague);
  return {
    id: toNumber(league?.id) ?? 0,
    name: typeof league?.name === "string" ? league.name : "Unknown",
    logo: typeof league?.logo === "string" ? league.logo : "",
    country: typeof league?.country === "string" ? league.country : "",
  };
}

function normalizeStatus(rawStatus: unknown): MatchWithPrediction["status"] {
  if (rawStatus === "live" || rawStatus === "finished" || rawStatus === "scheduled") {
    return rawStatus;
  }

  if (typeof rawStatus === "string") {
    const upper = rawStatus.toUpperCase();
    if (["FT", "AET", "PEN", "FINISHED"].includes(upper)) return "finished";
    if (["1H", "2H", "HT", "ET", "BT", "P", "LIVE", "IN_PLAY", "INH"].includes(upper)) return "live";
  }

  return "scheduled";
}

function transformWebMatch(item: unknown): MatchWithPrediction | null {
  const row = asRecord(item);
  if (!row) return null;

  const fixtureId = toNumber(row.fixtureId ?? row.fixture_id ?? row.id) ?? 0;
  if (!fixtureId) return null;

  const kickoffRaw = row.kickoffTime ?? row.kickoff_time;
  const kickoffTime = new Date(typeof kickoffRaw === "string" || typeof kickoffRaw === "number" ? kickoffRaw : Date.now());

  const scoreRecord = asRecord(row.score);
  const halfTimeRecord = asRecord(scoreRecord?.halftime);

  return {
    id: String(row.id ?? fixtureId),
    fixtureId,
    homeTeam: normalizeTeam(row.homeTeam ?? row.home_team),
    awayTeam: normalizeTeam(row.awayTeam ?? row.away_team),
    league: normalizeLeague(row.league),
    kickoffTime,
    status: normalizeStatus(row.status),
    score: scoreRecord
      ? {
        home: toNumber(scoreRecord.home) ?? 0,
        away: toNumber(scoreRecord.away) ?? 0,
        halftime: halfTimeRecord
          ? {
            home: toNumber(halfTimeRecord.home) ?? 0,
            away: toNumber(halfTimeRecord.away) ?? 0,
          }
          : undefined,
      }
      : undefined,
    elapsed: toNumber(row.elapsed),
    prediction: normalizePrediction(row.prediction ?? row.daily_proposition ?? row.proposition, fixtureId),
    isFavorite:
      typeof row.isFavorite === "boolean"
        ? row.isFavorite
        : typeof row.is_favorite === "boolean"
          ? row.is_favorite
          : undefined,
  };
}

async function fetchFixturesWithPredictions(date: string): Promise<MatchWithPrediction[]> {
  const data = await betlabFetch<WebDailyMatchesResponse>("/v1/web/matches/daily", {
    searchParams: { date },
    cache: "no-store",
  });

  return data.matches
    .map(transformWebMatch)
    .filter((match): match is MatchWithPrediction => Boolean(match));
}

export class BetlabFixtureRepository implements IFixtureRepository {
  async findByDate(date: string): Promise<Match[]> {
    return fetchFixtures(date);
  }

  async findLive(): Promise<Match[]> {
    return fetchLiveFixtures();
  }

  async findByDateWithPredictions(date: string): Promise<MatchWithPrediction[]> {
    return fetchFixturesWithPredictions(date);
  }
}
