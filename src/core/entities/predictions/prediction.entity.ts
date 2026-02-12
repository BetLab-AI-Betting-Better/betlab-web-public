/**
 * DOMAIN LAYER - Prediction Entities
 * Defines the normalized structures returned by the BetLab prediction models.
 * These types are consumed by the Presentation layer through the Application
 * services and Server Components.
 */

export type PredictionType =
  | "match_result"
  | "over_under"
  | "both_teams_score"
  | "correct_score"
  | "double_chance"
  | "draw_no_bet"
  | "asian_handicap"
  | "asian_totals"
  | "exact_goals"
  | "half_time"
  | "corners"
  | "first_goal";

export type ConfidenceLevel = "high" | "medium" | "low";

export type ProbabilityThresholds = {
  roi_3: number;
  roi_5: number;
  roi_8: number;
};

export interface MatchResultPrediction {
  fixtureId: number;
  type: "match_result";
  homeWin: ProbabilityNode;
  draw: ProbabilityNode;
  awayWin: ProbabilityNode;
  xG: {
    home: number;
    away: number;
  };
  xG_recent?: {
    home: number;
    away: number;
  };
  confidence: ConfidenceLevel;
  reasoning: string;
  analytics?: {
    formIndex?: { home: number; away: number };
    injuryFactor?: { home: number; away: number };
    defenseFactor?: { home: number; away: number };
    headToHead?: { bias: number; goalDelta: number };
    ratings?: { home: number; away: number };
    fatigue?: {
      restHours: { home: number; away: number };
      fatigueFactors: { home: number; away: number };
      travelDistance?: number;
    };
    opportunities?: Array<{
      type: string;
      label: string;
      prob: number;
    }>;
  };
  best_market?: {
    market: string;
    label?: string;
    prob: number;
    odds?: number;
    edge?: number;
    stake?: number;
  };
}

export interface OverUnderPrediction {
  fixtureId: number;
  type: "over_under";
  over25: ProbabilityNodeWithThreshold;
  under25: ProbabilityNodeWithThreshold;
  confidence: ConfidenceLevel;
}

export interface BTTSPrediction {
  fixtureId: number;
  type: "both_teams_score";
  yes: ProbabilityNodeWithThreshold;
  no: ProbabilityNode;
  cleanSheets?: {
    home: ProbabilityNode;
    away: ProbabilityNode;
  };
  confidence: ConfidenceLevel;
}

export interface CorrectScorePrediction {
  fixtureId: number;
  type: "correct_score";
  topScores: Array<{
    score: string;
    probability: number;
    odds: number;
  }>;
  mostLikely: string;
  confidence: ConfidenceLevel;
}

export interface DrawNoBetPrediction {
  fixtureId: number;
  type: "draw_no_bet";
  home: ProbabilityNodeWithThreshold;
  away?: ProbabilityNodeWithThreshold;
  refundProb?: number;
  confidence: ConfidenceLevel;
}

export interface AsianHandicapPrediction {
  fixtureId: number;
  type: "asian_handicap";
  lines: Array<{
    line: number;
    home: number;
    away: number;
    push: number;
  }>;
  confidence: ConfidenceLevel;
}

export interface AsianTotalsPrediction {
  fixtureId: number;
  type: "asian_totals";
  lines: Array<{
    line: number;
    over: number;
    under: number;
    push: number;
  }>;
  confidence: ConfidenceLevel;
}

export interface ExactGoalsPrediction {
  fixtureId: number;
  type: "exact_goals";
  distribution: Array<{
    goals: string;
    probability: number;
  }>;
  brackets: Array<{
    bracket: string;
    probability: number;
  }>;
  confidence: ConfidenceLevel;
}

export interface DoubleChancePrediction {
  fixtureId: number;
  type: "double_chance";
  homeOrDraw: ProbabilityNode;
  homeOrAway: ProbabilityNode;
  drawOrAway: ProbabilityNode;
  confidence: ConfidenceLevel;
}

export type PredictionData =
  | MatchResultPrediction
  | OverUnderPrediction
  | BTTSPrediction
  | CorrectScorePrediction
  | DrawNoBetPrediction
  | AsianHandicapPrediction
  | AsianTotalsPrediction
  | ExactGoalsPrediction
  | DoubleChancePrediction;

export interface PredictionWithUI {
  prediction: PredictionData;
  isExpanded?: boolean;
  isBookmarked?: boolean;
}

export interface ProbabilityNode {
  probability: number;
  odds: number;
  bookmakerOdds?: number;
  edge?: number;
}

export interface ProbabilityNodeWithThreshold extends ProbabilityNode {
  thresholds?: ProbabilityThresholds;
}
