/**
 * Probabilities Types
 * Types for the BetLab API probabilities endpoint
 */

export interface ProbabilitiesResponse {
  model_version: string;
  match_id: string;
  generated_at: number;
  inputs: ProbabilityInputs;
  markets: ProbabilityMarkets;
  implied_odds: ImpliedOdds;
  diagnostics: ProbabilityDiagnostics;
}

export interface ProbabilityInputs {
  mu_home: number;
  mu_away: number;
  mu_home_recent: number;
  mu_away_recent: number;
  form_index_home: number;
  form_index_away: number;
  injury_factor_home: number;
  injury_factor_away: number;
  defense_factor_home: number;
  defense_factor_away: number;
  head_to_head_bias: number;
  head_to_head_goal_delta: number;
  rating_home: number;
  rating_away: number;
  rest_hours_home: number;
  rest_hours_away: number;
  fatigue_factor_home: number;
  fatigue_factor_away: number;
  travel_distance_km: number;
  travel_factor_away: number;
  max_goals: number;
}

export interface ProbabilityMarkets {
  "1x2": {
    home: number;
    draw: number;
    away: number;
  };
  btts: {
    yes: number;
    no: number;
  };
  over_under: {
    over_0_5: number;
    under_0_5: number;
    over_1_5: number;
    under_1_5: number;
    over_2_5: number;
    under_2_5: number;
    over_3_5: number;
    under_3_5: number;
    over_4_5: number;
    under_4_5: number;
    over_5_5: number;
    under_5_5: number;
  };
  correct_score_top: Array<{
    score: string;
    probability: number;
  }>;
}

export interface ImpliedOdds {
  "1x2": {
    home: number;
    draw: number;
    away: number;
  };
  btts: {
    yes: number;
    no: number;
  };
}

export interface ProbabilityDiagnostics {
  ensemble_models: number;
  weights: string;
  lambda_home: number;
  lambda_away: number;
  lambda_home_recent: number;
  lambda_away_recent: number;
  rho: number;
  home_advantage: number;
  form_index_home: number;
  form_index_away: number;
  injury_factor_home: number;
  injury_factor_away: number;
  defense_factor_home: number;
  defense_factor_away: number;
  head_to_head_bias: number;
  head_to_head_goal_delta: number;
  rating_home: number;
  rating_away: number;
  rest_hours_home: number;
  rest_hours_away: number;
  fatigue_factor_home: number;
  fatigue_factor_away: number;
  travel_distance_km: number;
  travel_factor_away: number;
  models: string[];
}
