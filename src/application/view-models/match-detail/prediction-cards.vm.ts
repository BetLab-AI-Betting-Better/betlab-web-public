import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity"
import type { MatchResultPrediction } from "@/core/entities/predictions/prediction.entity"
import type { HtFtOutcome } from "@/core/entities/match-detail/ht-ft.entity"

export type ConfidenceBadge = {
  level: "high" | "medium" | "low"
  label: string
  className: string
}

const confidenceVariants: Record<ConfidenceBadge["level"], ConfidenceBadge> = {
  high: { level: "high", className: "bg-green-100 text-green-800", label: "Confiance elevee" },
  medium: { level: "medium", className: "bg-yellow-100 text-yellow-800", label: "Confiance moyenne" },
  low: { level: "low", className: "bg-red-100 text-red-800", label: "Confiance faible" },
}

export type MatchResultRow = {
  label: string
  probability: number
  odds?: number
}

export type MatchResultCardVM = {
  available: boolean
  title: string
  confidence?: ConfidenceBadge
  xg?: { home: string; away: string }
  rows: MatchResultRow[]
  reasoning?: string
  bestBetLabel?: string
}

export type BTTSCardVM = {
  available: boolean
  title: string
  confidence?: ConfidenceBadge
  yesProbability: number
  noProbability: number
  yesOdds?: number
  noOdds?: number
  bestChoice: "yes" | "no"
  reasoning: string
}

export type OverUnderCardVM = {
  available: boolean
  title: string
  confidence?: ConfidenceBadge
  over25: number
  under25: number
  over15: number
  under15: number
  over35: number
  under35: number
  bestChoice: "over" | "under"
}

export type CorrectScoreItemVM = { score: string; probability: number }

export type CorrectScoreCardVM = {
  available: boolean
  title: string
  confidence?: ConfidenceBadge
  topScores: CorrectScoreItemVM[]
  mostLikely?: string
  topShare: number
}

export type HtFtGridCellVM = {
  outcome: HtFtOutcome
  probability: number
  odds?: number
  highlight: boolean
}

export type HtFtRowVM = {
  label: string
  cells: HtFtGridCellVM[]
}

export type HtFtCardVM = {
  available: boolean
  title: string
  modelVersion?: string
  topOutcomes: Array<{ outcome: HtFtOutcome; label: string; probability: number; odds?: number }>
  rows: HtFtRowVM[]
  diagnostics?: {
    htRatioLeague: number
    htRatioHome: number
    htRatioAway: number
  }
}

export type PredictionCardsVM = {
  matchResult: MatchResultCardVM
  btts: BTTSCardVM
  overUnder: OverUnderCardVM
  correctScore: CorrectScoreCardVM
  htFt: HtFtCardVM
  corners: CornersCardVM
  asianHandicap: AsianHandicapCardVM
  asianTotals: AsianTotalsCardVM
  doubleChance: DoubleChanceCardVM
}

export type CornersRow = { line: number; over: number; under: number }

export type CornersCardVM = {
  available: boolean
  title: string
  confidence?: ConfidenceBadge
  expectedTotal: number
  rows: CornersRow[]
}

export type AsianHandicapLine = { line: number; home: number; away: number; push: number }

export type AsianHandicapCardVM = {
  available: boolean
  title: string
  confidence?: ConfidenceBadge
  lines: AsianHandicapLine[]
}

export type AsianTotalsLine = { line: number; over: number; under: number; push: number }

export type AsianTotalsCardVM = {
  available: boolean
  title: string
  confidence?: ConfidenceBadge
  lines: AsianTotalsLine[]
}

export type DoubleChanceCardVM = {
  available: boolean
  title: string
  confidence?: ConfidenceBadge
  homeOrDraw: number
  homeOrAway: number
  drawOrAway: number
  homeOrDrawOdds?: number
  homeOrAwayOdds?: number
  drawOrAwayOdds?: number
}

export type PredictionCardsVM = {
  matchResult: MatchResultCardVM
  btts: BTTSCardVM
  overUnder: OverUnderCardVM
  correctScore: CorrectScoreCardVM
  htFt: HtFtCardVM
  corners: CornersCardVM
  asianHandicap: AsianHandicapCardVM
  asianTotals: AsianTotalsCardVM
  doubleChance: DoubleChanceCardVM
}

const htStates = [
  { id: "H", label: (home: string) => `${home} mene a la MT` },
  { id: "D", label: () => "Score nul a la MT" },
  { id: "A", label: (_home: string, away: string) => `${away} mene a la MT` },
] as const

const ftStates = [
  { id: "H", label: (home: string) => `${home} gagne a la fin` },
  { id: "D", label: () => "Match nul a la fin" },
  { id: "A", label: (_home: string, away: string) => `${away} gagne a la fin` },
] as const

const outcomeLabels: Record<HtFtOutcome, string> = {
  HH: "Domicile / Domicile",
  HD: "Domicile / Nul",
  HA: "Domicile / Exterieur",
  DH: "Nul / Domicile",
  DD: "Nul / Nul",
  DA: "Nul / Exterieur",
  AH: "Exterieur / Domicile",
  AD: "Exterieur / Nul",
  AA: "Exterieur / Exterieur",
}

function confidenceFromDiff(diff: number): ConfidenceBadge {
  if (diff > 30) return confidenceVariants.high
  if (diff > 15) return confidenceVariants.medium
  return confidenceVariants.low
}

function confidenceFromTopProb(topProb: number): ConfidenceBadge {
  if (topProb > 20) return confidenceVariants.high
  if (topProb > 12) return confidenceVariants.medium
  return confidenceVariants.low
}

function buildMatchResultCard(match: MatchDetail, prediction?: MatchResultPrediction): MatchResultCardVM {
  if (!prediction) {
    return { available: false, title: "Resultat du match", rows: [] }
  }

  const rows: MatchResultRow[] = [
    { label: `${match.homeTeam.name} gagne`, probability: prediction.homeWin.probability * 100, odds: prediction.homeWin.odds },
    { label: "Match nul", probability: prediction.draw.probability * 100, odds: prediction.draw.odds },
    { label: `${match.awayTeam.name} gagne`, probability: prediction.awayWin.probability * 100, odds: prediction.awayWin.odds },
  ]

  const best = rows.reduce((acc, row) => (row.probability > acc.probability ? row : acc), rows[0])

  return {
    available: true,
    title: "Resultat du match",
    confidence: confidenceVariants[prediction.confidence],
    xg: prediction.xG
      ? {
        home: prediction.xG.home.toFixed(2),
        away: prediction.xG.away.toFixed(2),
      }
      : undefined,
    rows,
    reasoning: prediction.reasoning,
    bestBetLabel: best.label,
  }
}

function buildBttsCard(match: MatchDetail): BTTSCardVM {
  const probabilities = match.probabilities
  if (!probabilities) {
    return {
      available: false,
      title: "Les 2 equipes marquent",
      yesProbability: 0,
      noProbability: 0,
      bestChoice: "yes",
      reasoning: "",
    }
  }

  const { btts } = probabilities.markets
  const bttsOdds = probabilities.implied_odds.btts

  const yesPerc = btts.yes * 100
  const noPerc = btts.no * 100
  const bestChoice = yesPerc > noPerc ? "yes" : "no"

  const confidence = confidenceFromDiff(Math.abs(yesPerc - noPerc))
  const reasoning =
    yesPerc > 50
      ? `Il y a ${yesPerc.toFixed(0)}% de chances que les deux equipes marquent dans ce match.`
      : `Il y a ${noPerc.toFixed(0)}% de chances qu'au moins une equipe ne marque pas.`

  return {
    available: true,
    title: "Les 2 equipes marquent",
    confidence,
    yesProbability: yesPerc,
    noProbability: noPerc,
    yesOdds: bttsOdds.yes,
    noOdds: bttsOdds.no,
    bestChoice,
    reasoning,
  }
}

function buildOverUnderCard(match: MatchDetail): OverUnderCardVM {
  const probabilities = match.probabilities
  if (!probabilities) {
    return {
      available: false,
      title: "Plus/Moins 2.5 buts",
      over25: 0,
      under25: 0,
      over15: 0,
      under15: 0,
      over35: 0,
      under35: 0,
      bestChoice: "over",
    }
  }

  const { over_under } = probabilities.markets
  const over25 = over_under.over_2_5 * 100
  const under25 = over_under.under_2_5 * 100
  const bestChoice = over25 > under25 ? "over" : "under"

  return {
    available: true,
    title: "Plus/Moins 2.5 buts",
    confidence: confidenceFromDiff(Math.abs(over25 - under25)),
    over25,
    under25,
    over15: over_under.over_1_5 * 100,
    under15: over_under.under_1_5 * 100,
    over35: over_under.over_3_5 * 100,
    under35: over_under.under_3_5 * 100,
    bestChoice,
  }
}

function buildCorrectScoreCard(match: MatchDetail): CorrectScoreCardVM {
  const probabilities = match.probabilities
  if (!probabilities) {
    return {
      available: false,
      title: "Score Exact",
      topScores: [],
      topShare: 0,
    }
  }

  const topScores = probabilities.markets.correct_score_top.slice(0, 10)
  const mostLikely = topScores[0]?.score
  const topProb = (topScores[0]?.probability ?? 0) * 100

  return {
    available: true,
    title: "Score Exact",
    confidence: confidenceFromTopProb(topProb),
    topScores: topScores.map((item) => ({
      score: item.score,
      probability: item.probability * 100,
    })),
    mostLikely,
    topShare: topScores.reduce((sum, s) => sum + s.probability, 0) * 100,
  }
}

function buildHtFtCard(match: MatchDetail): HtFtCardVM {
  const data = match.htFtProbabilities
  if (!data) {
    return { available: false, title: "Mi-temps / Temps plein", topOutcomes: [], rows: [] }
  }

  const entries = Object.entries(data.probabilities) as [HtFtOutcome, number][]
  const topOutcomes = [...entries].sort((a, b) => b[1] - a[1]).slice(0, 3)
  const topOutcomeId = topOutcomes[0]?.[0]

  const rows: HtFtRowVM[] = htStates.map((htState) => {
    const label = htState.label(match.homeTeam.name, match.awayTeam.name)
    const cells = ftStates.map((ftState) => {
      const outcome = `${htState.id}${ftState.id}` as HtFtOutcome
      return {
        outcome,
        probability: data.probabilities[outcome] * 100,
        odds: data.implied_odds[outcome],
        highlight: outcome === topOutcomeId,
      }
    })
    return { label, cells }
  })

  return {
    available: true,
    title: "Mi-temps / Temps plein",
    modelVersion: data.model_version,
    topOutcomes: topOutcomes.map(([outcome, prob]) => ({
      outcome,
      label: outcomeLabels[outcome],
      probability: prob * 100,
      odds: data.implied_odds[outcome],
    })),
    rows,
    diagnostics: {
      htRatioLeague: data.diagnostics.ht_ratio_league,
      htRatioHome: data.diagnostics.ht_ratio_home,
      htRatioAway: data.diagnostics.ht_ratio_away,
    },
  }
}

function buildCornersCard(match: MatchDetail): CornersCardVM {
  const prediction = match.predictions?.find((p) => p.type === "corners") as any
  if (!prediction) return { available: false, title: "Corners", expectedTotal: 0, rows: [] }

  const rows: CornersRow[] = prediction.over.map((o: any, idx: number) => ({
    line: o.line,
    over: o.probability * 100,
    under: prediction.under[idx]?.probability * 100 || 0,
  }))

  return {
    available: true,
    title: "Corners (Over/Under)",
    confidence: confidenceVariants[prediction.confidence || "medium"],
    expectedTotal: prediction.expectedTotal,
    rows,
  }
}

function buildAsianHandicapCard(match: MatchDetail): AsianHandicapCardVM {
  const prediction = match.predictions?.find((p) => p.type === "asian_handicap") as any
  if (!prediction) return { available: false, title: "Handicap Asiatique", lines: [] }

  return {
    available: true,
    title: "Handicap Asiatique",
    confidence: confidenceVariants[prediction.confidence || "medium"],
    lines: prediction.lines.map((l: any) => ({
      line: l.line,
      home: l.home * 100,
      away: l.away * 100,
      push: l.push * 100,
    })),
  }
}

function buildAsianTotalsCard(match: MatchDetail): AsianTotalsCardVM {
  const prediction = match.predictions?.find((p) => p.type === "asian_totals") as any
  if (!prediction) return { available: false, title: "Totaux Asiatiques", lines: [] }

  return {
    available: true,
    title: "Totaux Asiatiques",
    confidence: confidenceVariants[prediction.confidence || "medium"],
    lines: prediction.lines.map((l: any) => ({
      line: l.line,
      over: l.over * 100,
      under: l.under * 100,
      push: l.push * 100,
    })),
  }
}

function buildDoubleChanceCard(match: MatchDetail): DoubleChanceCardVM {
  const prediction = match.predictions?.find((p) => p.type === "double_chance") as any
  if (!prediction)
    return { available: false, title: "Double Chance", homeOrDraw: 0, homeOrAway: 0, drawOrAway: 0 }

  return {
    available: true,
    title: "Double Chance",
    confidence: confidenceVariants[prediction.confidence || "medium"],
    homeOrDraw: prediction.homeOrDraw.probability * 100,
    homeOrAway: prediction.homeOrAway.probability * 100,
    drawOrAway: prediction.drawOrAway.probability * 100,
    homeOrDrawOdds: prediction.homeOrDraw.odds,
    homeOrAwayOdds: prediction.homeOrAway.odds,
    drawOrAwayOdds: prediction.drawOrAway.odds,
  }
}

export function buildPredictionCardsVM(match: MatchDetail): PredictionCardsVM {
  const resultPred = match.predictions?.find((p) => p.type === "match_result") as
    | MatchResultPrediction
    | undefined
  return {
    matchResult: buildMatchResultCard(match, resultPred),
    btts: buildBttsCard(match),
    overUnder: buildOverUnderCard(match),
    correctScore: buildCorrectScoreCard(match),
    htFt: buildHtFtCard(match),
    corners: buildCornersCard(match),
    asianHandicap: buildAsianHandicapCard(match),
    asianTotals: buildAsianTotalsCard(match),
    doubleChance: buildDoubleChanceCard(match),
  }
}
