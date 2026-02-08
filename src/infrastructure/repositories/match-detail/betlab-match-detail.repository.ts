import "server-only";

import { cache } from "react";
import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity";
import type { PredictionData, PredictionType } from "@/core/entities/predictions/prediction.entity";
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
  constructor(private readonly predictionRepository: IPredictionRepository) { }

  async getMatchDetail(fixtureId: number | string): Promise<MatchDetail> {
    const id = typeof fixtureId === "string" ? parseInt(fixtureId, 10) : fixtureId;
    const detail = await fetchMatch(id);

    await Promise.allSettled([
      this.attachPredictions(detail, id),
      this.attachProbabilities(detail, id),
      this.attachHtFtProbabilities(detail, id),
      this.attachStatistics(detail, id),
      this.attachLineups(detail, id),
      this.attachH2H(detail, id, detail.homeTeam.id, detail.awayTeam.id),
    ]);

    return detail;
  }

  async getLiveMatchDetail(fixtureId: number | string): Promise<MatchDetail> {
    const id = typeof fixtureId === "string" ? parseInt(fixtureId, 10) : fixtureId;
    return fetchMatch(id);
  }

  private async attachPredictions(detail: MatchDetail, fixtureId: number) {
    const types: PredictionType[] = [
      "match_result",
      "asian_handicap",
      "asian_totals",
      "exact_goals",
    ];

    try {
      const results = await Promise.allSettled(
        types.map((type) => this.predictionRepository.getPrediction(fixtureId, type))
      );

      detail.predictions = results
        .filter(
          (result): result is PromiseFulfilledResult<PredictionData> =>
            result.status === "fulfilled" && Boolean(result.value)
        )
        .map((result) => result.value);
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

  private async attachStatistics(detail: MatchDetail, fixtureId: number) {
    try {
      // Fetch stats for the whole match
      const stats = await betlabFetch<any[]>(`/api/fixtures/${fixtureId}/statistics`);

      // The API returns an array of 2 objects (one per team) containing an array of stats
      // Standardize into FixtureStatistic[]
      // We expect: [{ team: { id: ... }, statistics: [{ type: "Shots on Goal", value: 5 }, ...] }, ...]

      if (!Array.isArray(stats) || stats.length < 2) return;

      const homeStats = stats.find(s => s.team.id === detail.homeTeam.id)?.statistics || [];
      const awayStats = stats.find(s => s.team.id === detail.awayTeam.id)?.statistics || [];

      // Merge into a single list comparisons
      const unifiedStats: any[] = [];
      const statTypes = new Set([...homeStats.map((s: any) => s.type), ...awayStats.map((s: any) => s.type)]);

      statTypes.forEach(type => {
        const homeValue = homeStats.find((s: any) => s.type === type)?.value ?? 0;
        const awayValue = awayStats.find((s: any) => s.type === type)?.value ?? 0;
        unifiedStats.push({
          type,
          value: {
            home: homeValue,
            away: awayValue
          }
        });
      });

      detail.statistics = unifiedStats;

    } catch (error) {
      console.warn(`Failed to fetch statistics for match ${fixtureId}:`, error);
    }
  }

  private async attachLineups(detail: MatchDetail, fixtureId: number) {
    try {
      const lineups = await betlabFetch<any[]>(`/api/fixtures/${fixtureId}/lineups`);
      if (Array.isArray(lineups) && lineups.length > 0) {
        detail.lineups = lineups;
      }
    } catch (error) {
      console.warn(`Failed to fetch lineups for match ${fixtureId}:`, error);
    }
  }

  private async attachH2H(detail: MatchDetail, fixtureId: number, homeId: number, awayId: number) {
    try {
      // H2H requires team IDs joined by '-'
      if (!homeId || !awayId) return;

      const h2h = await betlabFetch<any[]>(`/api/fixtures/headtohead`, {
        searchParams: { h2h: `${homeId}-${awayId}`, last: "10" } // Limit to last 10
      });

      if (Array.isArray(h2h) && h2h.length > 0) {
        // Transform basic fixture data to match MatchDetail structure if needed, 
        // or just use what we get if it adheres to Match interface roughly.
        // The API returns full fixture objects usually.
        detail.h2h = h2h.map((item: any) => ({
          id: item.fixture.id.toString(),
          fixtureId: item.fixture.id,
          homeTeam: item.teams.home,
          awayTeam: item.teams.away,
          league: item.league,
          kickoffTime: new Date(item.fixture.date),
          status: ["FT", "AET", "PEN"].includes(item.fixture.status.short) ? "finished" : "scheduled", // simplified
          score: item.goals
        }));
      }
    } catch (error) {
      console.warn(`Failed to fetch H2H for match ${fixtureId}:`, error);
    }
  }
}
