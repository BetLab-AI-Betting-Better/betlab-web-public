import type { MatchWithPrediction } from "@/core/entities/fixtures/fixture.entity"
import type { PredictionData } from "@/core/entities/predictions/prediction.entity"
import { formatMarketLabel } from "./market-label.fr"
import { validateBestMarket, validatePrediction, type ValidationResult } from "@/application/predictions/validation"

export type MatchCardVM = {
  id: string
  kickoffTime: Date
  status: "scheduled" | "live" | "finished"
  elapsed?: number
  isFavorite?: boolean
  league: {
    name: string
    logo: string
  }
  home: {
    name: string
    logo: string
    xgLabel?: string
  }
  away: {
    name: string
    logo: string
    xgLabel?: string
  }
  score?: {
    home: number
    away: number
    halftime?: {
      home: number
      away: number
    }
  }
  probabilities?: {
    home: number
    draw: number
    away: number
  }
  bestMarket?: {
    label: string
    rawLabel: string
    prob: number
  }
  validation?: ValidationResult
  prediction?: PredictionData
}
function getBestMarket(prediction?: PredictionData, match?: MatchWithPrediction) {
  if (!prediction) return null
  const anyPred = prediction as unknown as {
    best_market?: {
      label?: string
      market?: string
      prob?: number
      probability?: number
      rule?: { label?: string }
    }
    bestMarket?: {
      label?: string
      market?: string
      prob?: number
      probability?: number
      rule?: { label?: string }
    }
  }

  const direct = anyPred.best_market ?? anyPred.bestMarket
  if (direct && (direct.prob ?? direct.probability) !== undefined) {
    const raw = direct.market ?? direct.label ?? direct.rule?.label
    const label = formatMarketLabel(raw, {
      homeName: match?.homeTeam?.name ?? "?quipe domicile",
      awayName: match?.awayTeam?.name ?? "?quipe ext?rieur",
    })
    if (label) {
      return { label, rawLabel: raw ?? "", prob: direct.prob ?? direct.probability ?? 0 }
    }
  }

  if (prediction.type === "match_result") {
    const p = prediction
    const opps = p.analytics?.opportunities ?? []
    if (opps.length > 0) {
      const best = opps.reduce((acc, cur) => (cur.prob > acc.prob ? cur : acc))
      const label =
        formatMarketLabel(best.label, {
          homeName: match?.homeTeam?.name ?? "?quipe domicile",
          awayName: match?.awayTeam?.name ?? "?quipe ext?rieur",
        }) || best.label
      return { label, rawLabel: best.label, prob: best.prob }
    }
    const home = p.homeWin?.probability ?? 0
    const draw = p.draw?.probability ?? 0
    const away = p.awayWin?.probability ?? 0
    const best = Math.max(home, draw, away)
    const label = best === home ? "V1" : best === draw ? "Nul" : "V2"
    const rawLabel = best === home ? "1x2_home" : best === draw ? "1x2_draw" : "1x2_away"
    return { label, rawLabel, prob: best }
  }

  return null
}

export function buildMatchCardVM(match: MatchWithPrediction): MatchCardVM {
  const kickoffSource = match.kickoffTime
  const kickoffTime =
    kickoffSource instanceof Date
      ? kickoffSource
      : new Date(kickoffSource ?? Date.now())
  const status = match.status ?? "scheduled"

  const bestMarket = getBestMarket(match.prediction, match)

  const validationBase = validatePrediction(match.prediction, match.score, status)
  const bestMarketOutcome =
    bestMarket && match.score
      ? validateBestMarket(bestMarket.rawLabel, match.score, status)
      : null

  const validation: ValidationResult | undefined =
    match.score && match.prediction
      ? {
        ...validationBase,
        bestMarketOutcome: bestMarketOutcome ?? validationBase.bestMarketOutcome,
      }
      : undefined

  const probabilities =
    match.prediction?.type === "match_result"
      ? {
        home: match.prediction.homeWin.probability * 100,
        draw: match.prediction.draw.probability * 100,
        away: match.prediction.awayWin.probability * 100,
      }
      : undefined

  return {
    id: match.id,
    kickoffTime,
    status,
    elapsed: match.elapsed,
    isFavorite: match.isFavorite,
    league: {
      name: match.league?.name ?? "",
      logo: (match.league?.logo || "").trim() || "/globe.svg",
    },
    home: {
      name: match.homeTeam?.name ?? "",
      logo: (match.homeTeam?.logo || "").trim() || "/icon-32.png",
      xgLabel:
        match.prediction?.type === "match_result" && typeof match.prediction.xG?.home === "number"
          ? `xG ${match.prediction.xG.home.toFixed(2)}`
          : match.prediction?.type === "match_result"
            ? "xG --"
            : undefined,
    },
    away: {
      name: match.awayTeam?.name ?? "",
      logo: (match.awayTeam?.logo || "").trim() || "/icon-32.png",
      xgLabel:
        match.prediction?.type === "match_result" && typeof match.prediction.xG?.away === "number"
          ? `xG ${match.prediction.xG.away.toFixed(2)}`
          : match.prediction?.type === "match_result"
            ? "xG --"
            : undefined,
    },
    score: match.score,
    probabilities,
    bestMarket: bestMarket
      ? {
        label: bestMarket.label,
        rawLabel: bestMarket.rawLabel,
        prob: Number.isFinite(bestMarket.prob)
          ? Number(bestMarket.prob)
          : 0,
      }
      : undefined,
    validation,
    prediction: match.prediction,
  }
}

export function formatBestMarketPercent(prob?: number) {
  if (prob === undefined || prob === null || Number.isNaN(prob)) return "--"
  return `${(prob * 100).toFixed(1)}%`
}
