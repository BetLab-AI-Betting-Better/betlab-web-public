/**
 * Prediction Validation — Pure utility functions
 *
 * Compares predictions to actual match results for finished matches.
 * No side effects, no API calls — purely client-side comparison.
 */

import type {
  PredictionData,
  MatchResultPrediction,
} from "@/core/entities/predictions/prediction.entity"

// ── Types ────────────────────────────────────────────

export type PredictionOutcome = "correct" | "incorrect" | "void" | "half-win" | "half-loss" | null

export interface ValidationResult {
  /** 1X2 prediction outcome */
  matchResultOutcome: PredictionOutcome
  /** Which outcome was predicted */
  predictedResult: "home" | "draw" | "away" | null
  /** Which outcome actually happened */
  actualResult: "home" | "draw" | "away" | null
  /** Best market opportunity outcome */
  bestMarketOutcome: PredictionOutcome
}

interface Score {
  home: number
  away: number
  halftime?: {
    home: number
    away: number
  }
}

// ── Core functions ───────────────────────────────────

/**
 * Determines the actual match result from the final score.
 */
export function getActualResult(score: Score): "home" | "draw" | "away" {
  if (score.home > score.away) return "home"
  if (score.home < score.away) return "away"
  return "draw"
}

/**
 * Determines the predicted outcome from a match_result prediction.
 * Returns the outcome with the highest probability.
 */
export function getPredictedResult(
  prediction: MatchResultPrediction
): "home" | "draw" | "away" {
  const home = prediction.homeWin.probability
  const draw = prediction.draw.probability
  const away = prediction.awayWin.probability
  const max = Math.max(home, draw, away)
  if (max === home) return "home"
  if (max === draw) return "draw"
  return "away"
}

// ── Best market validation ───────────────────────────

/**
 * Parses a numeric line from a market label (e.g., "2_5" → 2.5, "1_5" → 1.5)
 */
function parseLine(raw: string): number | null {
  const cleaned = raw.replace(/_/g, ".").replace(/,/g, ".")
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

/**
 * Extracts the numeric line value from a market label string.
 */
function extractLineFromLabel(label: string): number | null {
  const matches = label.match(/(\d+[._,]?\d*)/g)
  if (!matches || matches.length === 0) return null
  const last = matches[matches.length - 1] ?? ""
  return parseLine(last)
}

/**
 * Validates a best market opportunity label against the actual score.
 * Returns null for unrecognized or unvalidatable market types.
 */
/**
 * Validates a best market opportunity label against the actual score.
 * Returns null for unrecognized or unvalidatable market types.
 * 
 * @param status - Match status. If "live", only returns outcome if chemically determined (e.g. Over hit).
 */
export function validateBestMarket(
  rawLabel: string | undefined,
  score: Score,
  status: "scheduled" | "live" | "finished" = "finished"
): PredictionOutcome {
  if (!rawLabel) return null

  // If scheduled, no result possible yet
  if (status === "scheduled") return null

  const normalized = rawLabel
    .trim()
    .toLowerCase()
    .replace(/[.\s,]+/g, "_")

  const totalGoals = score.home + score.away

  // ── Helper for Asian Logic (Totals) ──
  const checkAsianTotal = (line: number, actual: number, direction: "over" | "under"): PredictionOutcome => {
    // Live Validation Logic
    if (status === "live") {
      // Over: If actual > line, it's a win (or half-win).
      // If actual == line, it's pending (could require more goals).
      // If actual < line, it's pending.
      if (direction === "over") {
        if (actual > line) return "correct"
        // Special case for .25 / .75?
        // 2.25 (2.0, 2.5). if 3 goals:
        // 3 > 2.0 (Win) & 3 > 2.5 (Win) -> Correct.
        // if 2 goals: 2 == 2.0 (Push) & 2 < 2.5 (Lose). Pending?
        // Actually if 2.25 and 2 goals, it's Half-Loss at end. Live? It's "losing" but might win.
        // So return null unless FULLY won?
        // If line is 2.25, and actual is 3. Correct.
        // If line is 2.75, and actual is 3. Half-Won. 
        // We can return "half-win" live? User asked "validate the prono".
        // Let's support "correct" and "half-win" for LIVE Over.

        // Quarter lines logic reuse? 
        // It's tricky to duplicate all logic.
        // Better: Run standard logic.
        // If standard logic returns "correct", return "correct".
        // If standard logic returns "half-win", return "half-win".
        // If standard logic returns "incorrect" or "half-loss" or "void", 
        // THEN check if it's FINAL. 
        // For OVER, "incorrect" is temporary. "void" is temporary (might score more).
        // So for OVER: Only return if Result is Positive (Correct/Half-Win).
      }

      // Under: If actual > line, it's a LOSS.
      // If standard logic returns "incorrect", return "incorrect".
      // If standard logic returns "half-loss", return "half-loss"? (e.g. Under 2.25 with 3 goals. 3 > 2.5 (Loss) & 3 > 2.0 (Loss). Full Loss.)
      // Under 2.75 with 3 goals. 3 > 2.5 (Loss). 3 == 3.0 (Push). Half-Loss.
      // So checking standard logic result is a good heuristic?

      // Let's use the standard logic result, then filter based on direction and status.
    }

    // 1. Integer Line (e.g., 3.0)
    if (Number.isInteger(line)) {
      if (actual === line) return status === "live" ? null : "void"
      if (direction === "over") {
        // Over 3.0
        // 4 goals -> correct.
        // 2 goals -> incorrect.
        if (actual > line) return "correct"
        return status === "live" ? null : "incorrect"
      }
      // Under 3.0
      // 4 goals -> incorrect.
      if (actual > line) return "incorrect"
      return status === "live" ? null : "correct"
    }

    // 2. Quarter Line (e.g., 2.25, 2.75)

    // Case .25 (e.g., 2.25)
    if (Math.abs(line % 1 - 0.25) < 0.01) {
      // .25 line (e.g., 2.25 = 2.0 & 2.5)
      const low = Math.floor(line)    // 2.0
      // const high = low + 0.5          // 2.5

      // Over 2.25:
      // - 3 goals: Win + Win -> Correct
      // - 2 goals: Push + Lose -> Half-Loss
      if (direction === "over") {
        if (actual > line) return "correct"
        if (actual === low) return status === "live" ? null : "half-loss"
        return status === "live" ? null : "incorrect"
      } else { // under
        // Under 2.25:
        // - 1 goal: Win + Win -> Correct
        // - 2 goals: Push + Win -> Half-Win
        // - 3 goals: Lose + Lose -> Incorrect
        if (actual < low) return status === "live" ? null : "correct"
        if (actual === low) return status === "live" ? null : "half-win"
        return "incorrect" // 3 goals > 2.25 -> lost
      }
    }

    // Case .75 (e.g., 2.75)
    if (Math.abs(line % 1 - 0.75) < 0.01) {
      // 2.75 is 2.5 & 3.0
      const high = Math.ceil(line)      // 3

      // Over 2.75:
      // - 4 goals: Win + Win -> Correct
      // - 3 goals: Win (Over 2.5) + Push (Over 3.0) -> Half-Win
      if (direction === "over") {
        if (actual > high) return "correct"
        if (actual === high) return "half-win" // 3 goals on 2.75 is Half-Win (won 2.5, push 3.0). Valid even live!
        return status === "live" ? null : "incorrect"
      } else { // under
        // Under 2.75:
        // - 2 goals: Win + Win -> Correct
        // - 3 goals: Lose + Push -> Half-Loss
        // - 4 goals: Lose + Lose -> Incorrect
        if (actual <= high - 1) return status === "live" ? null : "correct"
        if (actual === high) return "half-loss" // 3 goals on 2.75 Under is Half-Loss. Final? Yes because goals can't decrease.
        return "incorrect" // > 3 goals
      }
    }

    // Fallback for .5 (Standard)
    if (direction === "over") {
      if (actual > line) return "correct"
      return status === "live" ? null : "incorrect"
    }
    // Under .5
    if (actual > line) return "incorrect"
    return status === "live" ? null : "correct"
  }

  // ── Over / Under (total) ──
  // Checks standard over/under AND explicit asian/totals
  if (normalized.startsWith("over_") ||
    normalized.startsWith("total_over_") ||
    normalized.startsWith("asian_over_") ||
    normalized.startsWith("totals_asian_over_") ||
    normalized.startsWith("plus_de_")) {

    const prefix = normalized.startsWith("over_") ? "over_"
      : normalized.startsWith("total_over_") ? "total_over_"
        : normalized.startsWith("asian_over_") ? "asian_over_"
          : normalized.startsWith("totals_asian_over_") ? "totals_asian_over_"
            : "plus_de_"

    const line = extractLineFromLabel(normalized.replace(prefix, ""))
    if (line === null) return null
    return checkAsianTotal(line, totalGoals, "over")
  }

  if (normalized.startsWith("under_") ||
    normalized.startsWith("total_under_") ||
    normalized.startsWith("asian_under_") ||
    normalized.startsWith("totals_asian_under_") ||
    normalized.startsWith("moins_de_")) {

    const prefix = normalized.startsWith("under_") ? "under_"
      : normalized.startsWith("total_under_") ? "total_under_"
        : normalized.startsWith("asian_under_") ? "asian_under_"
          : normalized.startsWith("totals_asian_under_") ? "totals_asian_under_"
            : "moins_de_"

    const line = extractLineFromLabel(normalized.replace(prefix, ""))
    if (line === null) return null
    return checkAsianTotal(line, totalGoals, "under")
  }

  // ── BTTS ──
  if (["btts_yes", "both_teams_to_score_yes", "les_deux_equipes_marquent_oui"].includes(normalized)) {
    if (score.home > 0 && score.away > 0) return "correct"
    return status === "live" ? null : "incorrect"
  }

  if (["btts_no", "both_teams_to_score_no", "les_deux_equipes_marquent_non"].includes(normalized)) {
    if (score.home > 0 && score.away > 0) return "incorrect"
    return status === "live" ? null : "correct"
  }

  // ── 1X2 ──
  if (normalized === "1x2_home") {
    return score.home > score.away ? "correct" : "incorrect"
  }
  if (normalized === "1x2_draw") {
    return score.home === score.away ? "correct" : "incorrect"
  }
  if (normalized === "1x2_away") {
    return score.home < score.away ? "correct" : "incorrect"
  }

  // ── Double chance ──
  if (normalized.startsWith("double_chance_") || normalized.startsWith("dc_")) {
    const dc = normalized.replace(/^(double_chance_|dc_)/, "").replace(/_/g, "")
    if (dc === "1x") {
      return score.home >= score.away ? "correct" : "incorrect"
    }
    if (dc === "12") {
      return score.home !== score.away ? "correct" : "incorrect"
    }
    if (dc === "x2") {
      return score.home <= score.away ? "correct" : "incorrect"
    }
    return null
  }

  // ── DNB (draw = push → void) ──
  if (normalized === "dnb_home") {
    if (score.home === score.away) return "void" // push
    return score.home > score.away ? "correct" : "incorrect"
  }
  if (normalized === "dnb_away") {
    if (score.home === score.away) return "void" // push
    return score.home < score.away ? "correct" : "incorrect"
  }

  // ── Home/Away over/under (Team Totals) ──
  // Can reuse asian logic if we want team totals to also refund on integers
  // Standard team totals usually do refund on integers if they are explicitly asian lines,
  // but often simple over/under 1.5 etc are binary.
  // Given user request "Total less than 3 -> refund", likely applies effectively everywhere integer lines exist.

  const checkTeamTotal = (cleanLabel: string, actual: number) => {
    if (cleanLabel.startsWith("over_")) {
      const line = extractLineFromLabel(cleanLabel.replace("over_", ""))
      if (line === null) return null
      return checkAsianTotal(line, actual, "over")
    }
    if (cleanLabel.startsWith("under_")) {
      const line = extractLineFromLabel(cleanLabel.replace("under_", ""))
      if (line === null) return null
      return checkAsianTotal(line, actual, "under")
    }
    return null
  }

  if (normalized.startsWith("home_")) {
    return checkTeamTotal(normalized.replace("home_", ""), score.home)
  }
  if (normalized.startsWith("away_")) {
    return checkTeamTotal(normalized.replace("away_", ""), score.away)
  }

  if (normalized.startsWith("team_totals_home_")) {
    return checkTeamTotal(normalized.replace("team_totals_home_", ""), score.home)
  }
  if (normalized.startsWith("team_totals_away_")) {
    return checkTeamTotal(normalized.replace("team_totals_away_", ""), score.away)
  }

  if (normalized.startsWith("team_over_")) {
    // Ambiguous team? Usually context needed, but if prediction has team_over, 
    // it might be generic. Without team context, can't validate safely unless strict.
    // But typically "Team Total" correlates to the specific team in the object.
    // We will skip ambiguous ones or fix if we had context.
    return null
  }

  // ── Halftime Markets ──
  // ── Halftime Markets (Generalized) ──
  if (
    normalized.startsWith("ht_") ||
    normalized.startsWith("1h_") ||
    normalized.startsWith("half_time_") ||
    normalized.startsWith("1st_half_")
  ) {
    if (!score.halftime) return null

    // Create a proxy score for the first half
    // We only map home/away to the halftime scores. 
    // Halftime of a halftime doesn't exist, so undefined.
    const htScore: Score = {
      home: score.halftime.home,
      away: score.halftime.away
    }

    // Strip prefix
    let clean = normalized
    if (clean.startsWith("ht_")) clean = clean.replace("ht_", "")
    else if (clean.startsWith("1h_")) clean = clean.replace("1h_", "")
    else if (clean.startsWith("half_time_")) clean = clean.replace("half_time_", "")
    else if (clean.startsWith("1st_half_")) clean = clean.replace("1st_half_", "")

    // Explicitly handle "ht_1x2_home" -> "1x2_home" which works.
    // Specially handle Total Over/Under if they became just "over_X" -> works.

    // Recursive call
    // Prevent infinite recursion if stripping didn't change anything (unlikely with startsWith)
    if (clean === normalized) return null

    return validateBestMarket(clean, htScore, status)
  }

  // ── Asian handicap / corners → not validatable ──
  if (
    normalized.includes("asian") || // Specific asian totals handled above, this catches others
    normalized.includes("handicap") ||
    normalized.includes("corner")
  ) {
    return null
  }

  // ── Unrecognized market → null ──
  return null
}

// ── Main validation ──────────────────────────────────

/**
 * Validates a prediction against the actual match result.
 * Returns null fields when validation is not possible.
 */
export function validatePrediction(
  prediction: PredictionData | undefined,
  score: Score | undefined,
  status: "scheduled" | "live" | "finished"
): ValidationResult {
  const empty: ValidationResult = {
    matchResultOutcome: null,
    predictedResult: null,
    actualResult: null,
    bestMarketOutcome: null,
  }

  if (!score || !prediction) return empty
  if (status !== "finished" && status !== "live") return empty

  const actualResult = getActualResult(score)

  // Match result (1X2) validation — ONLY if finished
  let matchResultOutcome: PredictionOutcome = null
  let predictedResult: "home" | "draw" | "away" | null = null

  if (prediction.type === "match_result" && status === "finished") {
    predictedResult = getPredictedResult(prediction)
    matchResultOutcome = predictedResult === actualResult ? "correct" : "incorrect"
  }

  // Best market validation — extract raw label from opportunities
  // Supports LIVE validation if chemically determined
  let bestMarketOutcome: PredictionOutcome = null
  if (prediction.type === "match_result") {
    const opps = prediction.analytics?.opportunities ?? []
    if (opps.length > 0) {
      const best = opps.reduce((acc, cur) => (cur.prob > acc.prob ? cur : acc))
      bestMarketOutcome = validateBestMarket(best.label, score, status)
    } else if (status === "finished") {
      // Fallback: best market is the 1X2 result itself
      bestMarketOutcome = matchResultOutcome
    }
  }

  return {
    matchResultOutcome,
    predictedResult,
    actualResult,
    bestMarketOutcome,
  }
}
