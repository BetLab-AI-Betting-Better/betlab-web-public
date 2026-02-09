/**
 * Fixtures Feature Types
 *
 * Type definitions for the fixtures feature module.
 * Centralizes all fixture-related types for better maintainability.
 */

import type { PredictionData } from "@/core/entities/predictions/prediction.entity";

export interface Match {
  id: string;
  fixtureId: number;
  homeTeam: {
    id: number;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: number;
    name: string;
    logo: string;
  };
  league: {
    id: number;
    name: string;
    logo: string;
    country: string;
    season?: number;
  };
  kickoffTime: Date;
  status: "scheduled" | "live" | "finished";
  score?: {
    home: number;
    away: number;
    halftime?: {
      home: number;
      away: number;
    };
  };
  elapsed?: number;
}

/**
 * Fixture filtering options
 */
export interface FixtureFilters {
  date: Date;
  leagueId: number | null;
  searchQuery: string;
  predictionType?: string;
  confidences?: string[];
  xGRange?: [number, number];
  minProbability?: number;
}

/**
 * Match with predictions and favorites
 */
export interface MatchWithPrediction {
  id: string;
  fixtureId: number;
  homeTeam: {
    id: number;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: number;
    name: string;
    logo: string;
  };
  league: {
    id: number;
    name: string;
    logo: string;
    country: string;
  };
  kickoffTime: Date;
  status: "scheduled" | "live" | "finished";
  score?: {
    home: number;
    away: number;
    halftime?: {
      home: number;
      away: number;
    };
  };
  elapsed?: number;
  prediction?: PredictionData;
  isFavorite?: boolean;
}

/**
 * League information extracted from matches
 */
export interface LeagueInfo {
  id: number;
  name: string;
  logo: string;
  country: string;
  matchCount: number;
}

/**
 * Match count by date (for calendar widget)
 */
export interface MatchCountByDate {
  [date: string]: number; // ISO date string -> count
}
