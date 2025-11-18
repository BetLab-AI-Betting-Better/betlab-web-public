/**
 * Data transformation functions for prediction endpoints
 * Converts API responses to formats expected by prediction cards
 */

import type {
  ProbabilityThresholds,
  MatchResultPrediction,
  OverUnderPrediction,
  BTTSPrediction,
  CorrectScorePrediction,
  DrawNoBetPrediction,
  AsianHandicapPrediction,
  DoubleChancePrediction,
  PredictionData,
} from "@/core/entities/predictions/prediction.entity";

type GenericRecommendation = Record<string, unknown>

// ==========================================
// API Response Types
// ==========================================

export interface API1X2Response {
  generated_at: string
  model_version: string
  inputs: {
    match_id: string
    home_team: string
    away_team: string
    kickoff_utc: string | null
    mu_home: number
    mu_away: number
    mu_home_recent?: number
    mu_away_recent?: number
    form_index_home?: number
    form_index_away?: number
    injury_factor_home?: number
    injury_factor_away?: number
    defense_factor_home?: number
    defense_factor_away?: number
    head_to_head_bias?: number
    head_to_head_goal_delta?: number
    rating_home?: number
    rating_away?: number
    rest_hours_home?: number
    rest_hours_away?: number
    fatigue_factor_home?: number
    fatigue_factor_away?: number
    travel_distance_km?: number
    travel_factor_away?: number
    max_goals?: number
    [key: string]: string | number | boolean | null | undefined
  }
  markets: {
    home: number
    draw: number
    away: number
  }
  implied_odds: {
    home: number
    draw: number
    away: number
  }
}

export interface APIMarketsResponse {
  inputs: {
    mu_home: number
    mu_away: number
    cap: number
  }
  oneXtwo: {
    home: number
    draw: number
    away: number
  }
  markets: {
    dnb_home?: {
      prob_win: number
      prob_draw: number
      prob_loss: number
      fair_odds: number
      thresholds: ProbabilityThresholds
    }
    ah_home_m025?: {
      prob_win_full: number
      prob_half_loss: number
      prob_loss: number
      fair_odds: number
      thresholds: ProbabilityThresholds
    }
    over_2_5?: {
      prob: number
      fair_odds: number
      thresholds: ProbabilityThresholds
    }
    under_2_5?: {
      prob: number
      fair_odds: number
      thresholds: ProbabilityThresholds
    }
    btts_yes?: {
      prob: number
      fair_odds: number
      thresholds: ProbabilityThresholds
    }
    clean_sheet?: {
      home: {
        prob: number
        fair_odds: number
      }
      away: {
        prob: number
        fair_odds: number
      }
    }
    top_scores?: Array<{
      score: string
      prob: number
      fair_odds: number
    }>
  }
  recommendations: GenericRecommendation[]
  meta: {
    risk_profile: string
    min_edge: number
    hi_var_threshold: number
    stake_cap: number
  }
}

export interface APIOddsResponse {
  match_id: string
  bookmaker: string
  odds: {
    home?: number
    draw?: number
    away?: number
    dnb_home?: number
    ah_home_m025?: number
    over_2_5?: number
    under_2_5?: number
    btts_yes?: number
  }
  markets_available: string[]
  note?: string
}

// ==========================================
// Utility Functions
// ==========================================

export function calculateConfidence(probability: number): "high" | "medium" | "low" {
  if (probability >= 0.55) return "high"   // > 55%
  if (probability >= 0.45) return "medium" // 45-55%
  return "low"                             // < 45%
}

export function calculateEdge(fairOdds: number, bookmakerOdds?: number): number | undefined {
  if (!bookmakerOdds || bookmakerOdds <= 0 || fairOdds <= 0) return undefined
  // Edge = (Bookmaker Odds / Fair Odds) - 1
  return (bookmakerOdds / fairOdds) - 1
}

export function formatEdge(edge: number | undefined): string {
  if (edge === undefined) return "N/A"
  const percentage = (edge * 100).toFixed(1)
  return edge > 0 ? `+${percentage}%` : `${percentage}%`
}

export function isValueBet(edge: number | undefined, minEdge: number = 0.05): boolean {
  return edge !== undefined && edge >= minEdge
}

// ==========================================
// Transform Functions
// ==========================================

/**
 * Transform 1X2 endpoint response to MatchResultPrediction
 */
export function transform1X2ToPrediction(
  response: API1X2Response,
  odds: APIOddsResponse | null,
  fixtureId: number
): MatchResultPrediction {
  const homeEdge = calculateEdge(response.implied_odds.home, odds?.odds.home)
  const drawEdge = calculateEdge(response.implied_odds.draw, odds?.odds.draw)
  const awayEdge = calculateEdge(response.implied_odds.away, odds?.odds.away)

  const maxProb = Math.max(
    response.markets.home,
    response.markets.draw,
    response.markets.away
  )

  return {
    fixtureId,
    type: "match_result",
    homeWin: {
      probability: response.markets.home,
      odds: response.implied_odds.home,
      bookmakerOdds: odds?.odds.home,
      edge: homeEdge
    },
    draw: {
      probability: response.markets.draw,
      odds: response.implied_odds.draw,
      bookmakerOdds: odds?.odds.draw,
      edge: drawEdge
    },
    awayWin: {
      probability: response.markets.away,
      odds: response.implied_odds.away,
      bookmakerOdds: odds?.odds.away,
      edge: awayEdge
    },
    xG: {
      home: response.inputs.mu_home,
      away: response.inputs.mu_away
    },
    xG_recent: response.inputs.mu_home_recent && response.inputs.mu_away_recent ? {
      home: response.inputs.mu_home_recent,
      away: response.inputs.mu_away_recent
    } : undefined,
    confidence: calculateConfidence(maxProb),
    reasoning: `Basé sur le modèle ${response.model_version}. ${
      response.inputs.rating_home && response.inputs.rating_away
        ? `Ratings: ${Math.round(response.inputs.rating_home)} vs ${Math.round(response.inputs.rating_away)}.`
        : ""
    }`,
    analytics: {
      formIndex: response.inputs.form_index_home !== undefined && response.inputs.form_index_away !== undefined ? {
        home: response.inputs.form_index_home,
        away: response.inputs.form_index_away
      } : undefined,
      injuryFactor: response.inputs.injury_factor_home !== undefined && response.inputs.injury_factor_away !== undefined ? {
        home: response.inputs.injury_factor_home,
        away: response.inputs.injury_factor_away
      } : undefined,
      defenseFactor: response.inputs.defense_factor_home !== undefined && response.inputs.defense_factor_away !== undefined ? {
        home: response.inputs.defense_factor_home,
        away: response.inputs.defense_factor_away
      } : undefined,
      headToHead: response.inputs.head_to_head_bias !== undefined && response.inputs.head_to_head_goal_delta !== undefined ? {
        bias: response.inputs.head_to_head_bias,
        goalDelta: response.inputs.head_to_head_goal_delta
      } : undefined,
      ratings: response.inputs.rating_home && response.inputs.rating_away ? {
        home: response.inputs.rating_home,
        away: response.inputs.rating_away
      } : undefined,
      fatigue: response.inputs.rest_hours_home !== undefined && response.inputs.rest_hours_away !== undefined ? {
        restHours: {
          home: response.inputs.rest_hours_home,
          away: response.inputs.rest_hours_away
        },
        fatigueFactors: {
          home: response.inputs.fatigue_factor_home ?? 1,
          away: response.inputs.fatigue_factor_away ?? 1
        },
        travelDistance: response.inputs.travel_distance_km
      } : undefined
    }
  }
}

/**
 * Transform Markets endpoint response to OverUnderPrediction
 */
export function transformMarketsToOverUnder(
  response: APIMarketsResponse,
  odds: APIOddsResponse | null,
  fixtureId: number
): OverUnderPrediction {
  const over25 = response.markets.over_2_5
  const under25 = response.markets.under_2_5

  if (!over25 || !under25) {
    throw new Error("Over/Under 2.5 data not available in markets response")
  }

  const overEdge = calculateEdge(over25.fair_odds, odds?.odds.over_2_5)
  const underEdge = calculateEdge(under25.fair_odds, odds?.odds.under_2_5)

  const maxProb = Math.max(over25.prob, under25.prob)

  return {
    fixtureId,
    type: "over_under",
    over25: {
      probability: over25.prob,
      odds: over25.fair_odds,
      bookmakerOdds: odds?.odds.over_2_5,
      edge: overEdge,
      thresholds: over25.thresholds
    },
    under25: {
      probability: under25.prob,
      odds: under25.fair_odds,
      bookmakerOdds: odds?.odds.under_2_5,
      edge: underEdge,
      thresholds: under25.thresholds
    },
    confidence: calculateConfidence(maxProb)
  }
}

/**
 * Transform Markets endpoint response to BTTSPrediction
 */
export function transformMarketsToBTTS(
  response: APIMarketsResponse,
  odds: APIOddsResponse | null,
  fixtureId: number
): BTTSPrediction {
  const bttsYes = response.markets.btts_yes
  const cleanSheet = response.markets.clean_sheet

  if (!bttsYes || !cleanSheet) {
    throw new Error("BTTS data not available in markets response")
  }

  const yesEdge = calculateEdge(bttsYes.fair_odds, odds?.odds.btts_yes)
  const noProb = 1 - bttsYes.prob
  const noOdds = noProb > 0 ? 1 / noProb : 0

  return {
    fixtureId,
    type: "both_teams_score",
    yes: {
      probability: bttsYes.prob,
      odds: bttsYes.fair_odds,
      bookmakerOdds: odds?.odds.btts_yes,
      edge: yesEdge,
      thresholds: bttsYes.thresholds
    },
    no: {
      probability: noProb,
      odds: noOdds
    },
    cleanSheets: {
      home: {
        probability: cleanSheet.home.prob,
        odds: cleanSheet.home.fair_odds
      },
      away: {
        probability: cleanSheet.away.prob,
        odds: cleanSheet.away.fair_odds
      }
    },
    confidence: calculateConfidence(Math.max(bttsYes.prob, noProb))
  }
}

/**
 * Transform Markets endpoint response to CorrectScorePrediction
 */
export function transformMarketsToCorrectScore(
  response: APIMarketsResponse,
  fixtureId: number
): CorrectScorePrediction {
  const topScores = response.markets.top_scores

  if (!topScores || topScores.length === 0) {
    throw new Error("Correct score data not available in markets response")
  }

  return {
    fixtureId,
    type: "correct_score",
    topScores: topScores.map(score => ({
      score: score.score,
      probability: score.prob,
      odds: score.fair_odds
    })),
    mostLikely: topScores[0].score,
    confidence: calculateConfidence(topScores[0].prob)
  }
}

/**
 * Transform Markets endpoint response to DrawNoBetPrediction
 */
export function transformMarketsToDrawNoBet(
  response: APIMarketsResponse,
  odds: APIOddsResponse | null,
  fixtureId: number
): DrawNoBetPrediction {
  const dnb = response.markets.dnb_home

  if (!dnb) {
    throw new Error("Draw No Bet data not available in markets response")
  }

  const edge = calculateEdge(dnb.fair_odds, odds?.odds.dnb_home)

  return {
    fixtureId,
    type: "draw_no_bet",
    home: {
      probability: dnb.prob_win,
      odds: dnb.fair_odds,
      bookmakerOdds: odds?.odds.dnb_home,
      edge,
      thresholds: dnb.thresholds
    },
    refundProb: dnb.prob_draw,
    confidence: calculateConfidence(dnb.prob_win)
  }
}

/**
 * Transform Markets endpoint response to AsianHandicapPrediction
 */
export function transformMarketsToAsianHandicap(
  response: APIMarketsResponse,
  odds: APIOddsResponse | null,
  fixtureId: number
): AsianHandicapPrediction {
  const ah = response.markets.ah_home_m025

  if (!ah) {
    throw new Error("Asian Handicap data not available in markets response")
  }

  const edge = calculateEdge(ah.fair_odds, odds?.odds.ah_home_m025)

  return {
    fixtureId,
    type: "asian_handicap",
    homeMinusQuarter: {
      winFull: ah.prob_win_full,
      halfLoss: ah.prob_half_loss,
      loss: ah.prob_loss,
      odds: ah.fair_odds,
      bookmakerOdds: odds?.odds.ah_home_m025,
      edge,
      thresholds: ah.thresholds
    },
    confidence: calculateConfidence(ah.prob_win_full)
  }
}

/**
 * Transform double chance from 1X2 probabilities
 */
export function transformMarketsToDoubleChance(
  response: APIMarketsResponse,
  fixtureId: number
) {
  const { home, draw, away } = response.oneXtwo

  return {
    fixtureId,
    type: "double_chance" as const,
    homeOrDraw: {
      probability: home + draw,
      odds: 1 / (home + draw)
    },
    homeOrAway: {
      probability: home + away,
      odds: 1 / (home + away)
    },
    drawOrAway: {
      probability: draw + away,
      odds: 1 / (draw + away)
    },
    confidence: calculateConfidence(Math.max(home + draw, home + away, draw + away))
  }
}
