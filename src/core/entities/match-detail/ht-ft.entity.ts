export type HtFtOutcome =
  | "HH"
  | "HD"
  | "HA"
  | "DH"
  | "DD"
  | "DA"
  | "AH"
  | "AD"
  | "AA";

export interface HtFtProbabilitiesResponse {
  model_version: string;
  match_id: string;
  generated_at: string;
  home_team: string;
  away_team: string;
  probabilities: Record<HtFtOutcome, number>;
  implied_odds: Record<HtFtOutcome, number>;
  diagnostics: {
    lambda_home: number;
    lambda_away: number;
    ht_ratio_league: number;
    ht_ratio_home: number;
    ht_ratio_away: number;
    rho: number;
  };
}
