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
  AsianTotalsPrediction,
  ExactGoalsPrediction,
  DoubleChancePrediction,
  CornersPrediction,
  EuropeanHandicapPrediction,
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
  opportunities?: Array<{
    type: string
    label: string
    prob: number
  }>
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
    handicap_simple?: Array<{
      line: number
      home: number
      draw: number
      away: number
    }>
    handicap_asian?: Array<{
      line: number
      home: number
      away: number
      push: number
    }>
    totals_asian?: Array<{
      line: number
      over: number
      under: number
      push: number
    }>
    exact_goals?: Array<{
      goals: string
      probability: number
    }>
    goal_brackets?: Array<{
      bracket: string
      probability: number
    }>
    [key: string]: any
  }
  opportunities?: Array<{
    type: string
    label: string
    prob: number
  }>
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
    reasoning: `Basé sur le modèle ${response.model_version}. ${response.inputs.rating_home && response.inputs.rating_away
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
      } : undefined,
      opportunities: response.opportunities
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
  const ah = response.markets.handicap_asian

  if (!ah) {
    throw new Error("Asian Handicap data not available in markets response")
  }

  const maxWinProb = Math.max(...ah.map(l => l.home), ...ah.map(l => l.away))

  return {
    fixtureId,
    type: "asian_handicap",
    lines: ah.map(l => ({
      line: l.line,
      home: l.home,
      away: l.away,
      push: l.push
    })),
    confidence: calculateConfidence(maxWinProb)
  }
}

/**
 * Transform Markets endpoint response to AsianTotalsPrediction
 */
export function transformMarketsToAsianTotals(
  response: APIMarketsResponse,
  odds: APIOddsResponse | null,
  fixtureId: number
): AsianTotalsPrediction {
  const totals = response.markets.totals_asian

  if (!totals) {
    throw new Error("Asian Totals data not available in markets response")
  }

  const maxProb = Math.max(...totals.map(l => l.over), ...totals.map(l => l.under))

  return {
    fixtureId,
    type: "asian_totals",
    lines: totals.map(l => ({
      line: l.line,
      over: l.over,
      under: l.under,
      push: l.push
    })),
    confidence: calculateConfidence(maxProb)
  }
}

/**
 * Transform Markets endpoint response to ExactGoalsPrediction
 */
export function transformMarketsToExactGoals(
  response: APIMarketsResponse,
  fixtureId: number
): ExactGoalsPrediction {
  const exact = response.markets.exact_goals
  const brackets = response.markets.goal_brackets

  if (!exact || !brackets) {
    throw new Error("Goals distribution data not available in markets response")
  }

  const maxProb = Math.max(...exact.map(l => l.probability))

  return {
    fixtureId,
    type: "exact_goals",
    distribution: exact.map(g => ({
      goals: g.goals,
      probability: g.probability
    })),
    brackets: brackets.map(b => ({
      bracket: b.bracket,
      probability: b.probability
    })),
    confidence: calculateConfidence(maxProb)
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

/**
 * Transform Markets endpoint response to CornersPrediction
 */
export function transformMarketsToCorners(
  response: APIMarketsResponse,
  fixtureId: number
): CornersPrediction {
  const markets = response.markets;
  const over: Array<{ line: number; probability: number }> = [];
  const under: Array<{ line: number; probability: number }> = [];

  Object.keys(markets).forEach(key => {
    if (key.startsWith("corners_over_")) {
      const lineStr = key.replace("corners_over_", "").replace("_", ".");
      const line = parseFloat(lineStr);
      if (!isNaN(line)) {
        over.push({ line, probability: markets[key].prob });
      }
    } else if (key.startsWith("corners_under_")) {
      const lineStr = key.replace("corners_under_", "").replace("_", ".");
      const line = parseFloat(lineStr);
      if (!isNaN(line)) {
        under.push({ line, probability: markets[key].prob });
      }
    }
  });

  over.sort((a, b) => a.line - b.line);
  under.sort((a, b) => a.line - b.line);

  // Fallback if no lines found
  if (over.length === 0 && under.length === 0) {
    return {
      fixtureId,
      type: "corners",
      over: [],
      under: [],
      expectedTotal: 0,
      confidence: "low"
    };
  }

  // Use the predicted values from inputs if available
  const muHome = (response.inputs as any).mu_corners_home ?? 5;
  const muAway = (response.inputs as any).mu_corners_away ?? 4;
  const expectedTotal = muHome + muAway;

  return {
    fixtureId,
    type: "corners",
    over,
    under,
    expectedTotal,
    confidence: "medium"
  };
}

/**
 * Transform Markets endpoint response to EuropeanHandicapPrediction
 */
export function transformMarketsToEuropeanHandicap(
  response: APIMarketsResponse,
  fixtureId: number
): EuropeanHandicapPrediction {
  const markets = response.markets;
  const linesMap: Record<number, { line: number; home: number; draw: number; away: number }> = {};

  Object.keys(markets).forEach(key => {
    // Keys like ehc_1_1, ehc_1_X, ehc_1_2
    const match = key.match(/^ehc_(-?\d+)_([1X2])$/);
    if (match) {
      const line = parseInt(match[1], 10);
      const outcome = match[2];

      if (!linesMap[line]) {
        linesMap[line] = { line, home: 0, draw: 0, away: 0 };
      }

      if (outcome === "1") linesMap[line].home = markets[key].prob;
      else if (outcome === "X") linesMap[line].draw = markets[key].prob;
      else if (outcome === "2") linesMap[line].away = markets[key].prob;
    }
  });

  const lines = Object.values(linesMap).sort((a, b) => a.line - b.line);

  return {
    fixtureId,
    type: "european_handicap",
    lines,
    confidence: "medium"
  };
}
