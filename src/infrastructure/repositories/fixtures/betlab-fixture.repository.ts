import "server-only";

import { cache } from "react";
import type { Match } from "@/core/entities/fixtures/fixture.entity";
import type { IFixtureRepository } from "@/core/repositories/fixture.repository";
import { betlabFetch } from "@/infrastructure/services/betlab-api/client";

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

export class BetlabFixtureRepository implements IFixtureRepository {
  async findByDate(date: string): Promise<Match[]> {
    return fetchFixtures(date);
  }

  async findLive(): Promise<Match[]> {
    return fetchLiveFixtures();
  }
}
