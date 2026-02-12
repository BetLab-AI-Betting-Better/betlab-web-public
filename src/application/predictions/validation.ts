/**
 * Prediction Validation ? Pure utility functions
 *
 * Compares predictions to actual match results for finished matches.
 * No side effects, no API calls ? purely client-side comparison.
 */

import type {
  PredictionData,
  MatchResultPrediction,
} from "@/core/entities/predictions/prediction.entity"

export type PredictionOutcome =
  | "correct"
  | "incorrect"
  | "void"
  | "half-win"
  | "half-loss"
  | null

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

export function getActualResult(score: Score): "home" | "draw" | "away" {
  if (score.home > score.away) return "home"
  if (score.home < score.away) return "away"
  return "draw"
}

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

function parseLine(raw: string): number | null {
  const cleaned = raw.replace(/_/g, ".").replace(/,/g, ".")
  const num = parseFloat(cleaned)
  return Number.isNaN(num) ? null : num
}

function extractLineFromLabel(label: string): number | null {
  const matches = label.match(/(\d+[._,]?\d*)/g)
  if (!matches || matches.length === 0) return null
  const last = matches[matches.length - 1] ?? ""
  return parseLine(last)
}

export function validateBestMarket(
  rawLabel: string | undefined,
  score: Score,
  status: "scheduled" | "live" | "finished" = "finished"
): PredictionOutcome {
  if (!rawLabel) return null
  if (status === "scheduled") return null

  const normalized = rawLabel
    .trim()
    .toLowerCase()
    .replace(/[.\s,]+/g, "_")

  const totalGoals = score.home + score.away

  const checkAsianTotal = (
    line: number,
    actual: number,
    direction: "over" | "under"
  ): PredictionOutcome => {
    if (Number.isInteger(line)) {
      if (actual === line) return status === "live" ? null : "void"
      if (direction === "over") {
        if (actual > line) return "correct"
        return status === "live" ? null : "incorrect"
      }
      if (actual > line) return "incorrect"
      return status === "live" ? null : "correct"
    }

    if (Math.abs(line % 1 - 0.25) < 0.01) {
      const low = Math.floor(line)
      if (direction === "over") {
        if (actual > line) return "correct"
        if (actual === low) return status === "live" ? null : "half-loss"
        return status === "live" ? null : "incorrect"
      }
      if (actual < low) return status === "live" ? null : "correct"
      if (actual === low) return status === "live" ? null : "half-win"
      return "incorrect"
    }

    if (Math.abs(line % 1 - 0.75) < 0.01) {
      const high = Math.ceil(line)
      if (direction === "over") {
        if (actual > high) return "correct"
        if (actual === high) return "half-win"
        return status === "live" ? null : "incorrect"
      }
      if (actual <= high - 1) return status === "live" ? null : "correct"
      if (actual === high) return "half-loss"
      return "incorrect"
    }

    if (direction === "over") {
      if (actual > line) return "correct"
      return status === "live" ? null : "incorrect"
    }
    if (actual > line) return "incorrect"
    return status === "live" ? null : "correct"
  }

  if (
    normalized.startsWith("over_") ||
    normalized.startsWith("total_over_") ||
    normalized.startsWith("asian_over_") ||
    normalized.startsWith("totals_asian_over_") ||
    normalized.startsWith("plus_de_")
  ) {
    const prefix = normalized.startsWith("over_")
      ? "over_"
      : normalized.startsWith("total_over_")
        ? "total_over_"
        : normalized.startsWith("asian_over_")
          ? "asian_over_"
          : normalized.startsWith("totals_asian_over_")
            ? "totals_asian_over_"
            : "plus_de_"

    const line = extractLineFromLabel(normalized.replace(prefix, ""))
    if (line === null) return null
    return checkAsianTotal(line, totalGoals, "over")
  }

  if (
    normalized.startsWith("under_") ||
    normalized.startsWith("total_under_") ||
    normalized.startsWith("asian_under_") ||
    normalized.startsWith("totals_asian_under_") ||
    normalized.startsWith("moins_de_")
  ) {
    const prefix = normalized.startsWith("under_")
      ? "under_"
      : normalized.startsWith("total_under_")
        ? "total_under_"
        : normalized.startsWith("asian_under_")
          ? "asian_under_"
          : normalized.startsWith("totals_asian_under_")
            ? "totals_asian_under_"
            : "moins_de_"

    const line = extractLineFromLabel(normalized.replace(prefix, ""))
    if (line === null) return null
    return checkAsianTotal(line, totalGoals, "under")
  }

  if (
    [
      "btts_yes",
      "both_teams_to_score_yes",
      "les_deux_equipes_marquent_oui",
    ].includes(normalized)
  ) {
    if (score.home > 0 && score.away > 0) return "correct"
    return status === "live" ? null : "incorrect"
  }

  if (
    [
      "btts_no",
      "both_teams_to_score_no",
      "les_deux_equipes_marquent_non",
    ].includes(normalized)
  ) {
    if (score.home > 0 && score.away > 0) return "incorrect"
    return status === "live" ? null : "correct"
  }

  if (normalized === "1x2_home") {
    return score.home > score.away ? "correct" : "incorrect"
  }
  if (normalized === "1x2_draw") {
    return score.home === score.away ? "correct" : "incorrect"
  }
  if (normalized === "1x2_away") {
    return score.home < score.away ? "correct" : "incorrect"
  }

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

  if (normalized === "dnb_home") {
    if (score.home === score.away) return "void"
    return score.home > score.away ? "correct" : "incorrect"
  }
  if (normalized === "dnb_away") {
    if (score.home === score.away) return "void"
    return score.home < score.away ? "correct" : "incorrect"
  }

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
    return null
  }

  if (
    normalized.startsWith("ht_") ||
    normalized.startsWith("1h_") ||
    normalized.startsWith("half_time_") ||
    normalized.startsWith("1st_half_")
  ) {
    if (!score.halftime) return null

    const htScore: Score = {
      home: score.halftime.home,
      away: score.halftime.away,
    }

    let clean = normalized
    if (clean.startsWith("ht_")) clean = clean.replace("ht_", "")
    else if (clean.startsWith("1h_")) clean = clean.replace("1h_", "")
    else if (clean.startsWith("half_time_")) clean = clean.replace("half_time_", "")
    else if (clean.startsWith("1st_half_")) clean = clean.replace("1st_half_", "")

    if (clean === normalized) return null

    return validateBestMarket(clean, htScore, status)
  }

  if (
    normalized.includes("asian") ||
    normalized.includes("handicap") ||
    normalized.includes("corner")
  ) {
    return null
  }

  return null
}

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

  let matchResultOutcome: PredictionOutcome = null
  let predictedResult: "home" | "draw" | "away" | null = null

  if (prediction.type === "match_result" && status === "finished") {
    predictedResult = getPredictedResult(prediction)
    matchResultOutcome = predictedResult === actualResult ? "correct" : "incorrect"
  }

  let bestMarketOutcome: PredictionOutcome = null
  if (prediction.type === "match_result") {
    const opps = prediction.analytics?.opportunities ?? []
    if (opps.length > 0) {
      const best = opps.reduce((acc, cur) => (cur.prob > acc.prob ? cur : acc))
      bestMarketOutcome = validateBestMarket(best.label, score, status)
    } else if (status === "finished") {
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
