import type { Match } from "@/core/entities/fixtures/fixture.entity";
import type { PredictionData } from "@/core/entities/predictions/prediction.entity";
import type { ProbabilitiesResponse } from "./probabilities.entity";
import type { HtFtProbabilitiesResponse } from "./ht-ft.entity";

export interface FixtureStatistic {
  type: string;
  value: {
    home: string | number | null;
    away: string | number | null;
  };
}

export interface FixturePlayer {
  id: number;
  name: string;
  number: number;
  pos: string;
  grid: string | null;
}

export interface FixtureLineup {
  team: {
    id: number;
    name: string;
    logo: string;
    colors?: {
      player: { primary: string; number: string; border: string };
      goalkeeper: { primary: string; number: string; border: string };
    };
  };
  coach: {
    id: number;
    name: string;
    photo?: string;
  };
  formation: string;
  startXI: FixturePlayer[];
  substitutes: FixturePlayer[];
}

export interface FixtureEvent {
  time: {
    elapsed: number;
    extra?: number;
  };
  team: {
    id: number;
    name: string;
    logo: string;
  };
  player: {
    id: number;
    name: string;
  };
  assist: {
    id: number | null;
    name: string | null;
  };
  type: string;
  detail: string;
  comments: string | null;
}

export interface HeadToHead extends Match {
  // Inherits standard match properties
}

export interface PlayerStats {
  id: number;
  name: string;
  minutes: number;
  goals: number;
  assists: number;
  xg: number;
  xa: number;
  rating: number | null;
  // Enriched stats
  tackles: number;
  duels_total: number;
  duels_won: number;
  dribbles_attempts: number;
  dribbles_success: number;
  fouls_drawn: number;
  fouls_committed: number;
  yellow: number;
  red: number;
  passes_total: number;
  passes_accuracy: number;
  saves: number;
}

export interface MatchDetail extends Match {
  venue?: string;
  referee?: string;
  predictions?: PredictionData[];
  probabilities?: ProbabilitiesResponse;
  htFtProbabilities?: HtFtProbabilitiesResponse;

  // New enriched data
  statistics?: FixtureStatistic[];
  lineups?: FixtureLineup[];
  events?: FixtureEvent[];
  h2h?: HeadToHead[];
  playersStats?: Record<number, PlayerStats>; // Map playerId -> stats
}
