"use client"

import { cn } from "@/shared/utils"
import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity"
import type { PredictionData } from "@/core/entities/predictions/prediction.entity"
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, XCircle } from "lucide-react"

interface ValueBetsTabProps {
  match: MatchDetail
  predictions?: PredictionData[]
}

interface ValueBet {
  market: string
  label: string
  probability: number
  fairOdds: number
  bookmakerOdds?: number
  edge?: number
  recommendation: "strong" | "moderate" | "avoid" | "neutral"
}

/**
 * Onglet Value Bets - Affiche les meilleurs paris avec edge positif
 */
export function ValueBetsTab({ match, predictions }: ValueBetsTabProps) {
  if (!predictions || predictions.length === 0) {
    return (
      <div className="p-4">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Value Bets indisponibles</h3>
          <p className="text-muted-foreground">
            Les données de cotes bookmaker ne sont pas disponibles pour ce match.
          </p>
        </div>
      </div>
    )
  }

  const valueBets: ValueBet[] = []

  // Extract value bets from all predictions
  predictions.forEach(prediction => {
    if (prediction.type === "match_result") {
      valueBets.push({
        market: "home",
        label: `Victoire ${match.homeTeam.name}`,
        probability: prediction.homeWin.probability,
        fairOdds: prediction.homeWin.odds,
        bookmakerOdds: prediction.homeWin.bookmakerOdds,
        edge: prediction.homeWin.edge,
        recommendation: getRecommendation(prediction.homeWin.edge)
      })
      valueBets.push({
        market: "draw",
        label: "Match nul",
        probability: prediction.draw.probability,
        fairOdds: prediction.draw.odds,
        bookmakerOdds: prediction.draw.bookmakerOdds,
        edge: prediction.draw.edge,
        recommendation: getRecommendation(prediction.draw.edge)
      })
      valueBets.push({
        market: "away",
        label: `Victoire ${match.awayTeam.name}`,
        probability: prediction.awayWin.probability,
        fairOdds: prediction.awayWin.odds,
        bookmakerOdds: prediction.awayWin.bookmakerOdds,
        edge: prediction.awayWin.edge,
        recommendation: getRecommendation(prediction.awayWin.edge)
      })
    } else if (prediction.type === "over_under") {
      valueBets.push({
        market: "over_2_5",
        label: "Plus de 2.5 buts",
        probability: prediction.over25.probability,
        fairOdds: prediction.over25.odds,
        bookmakerOdds: prediction.over25.bookmakerOdds,
        edge: prediction.over25.edge,
        recommendation: getRecommendation(prediction.over25.edge)
      })
      valueBets.push({
        market: "under_2_5",
        label: "Moins de 2.5 buts",
        probability: prediction.under25.probability,
        fairOdds: prediction.under25.odds,
        bookmakerOdds: prediction.under25.bookmakerOdds,
        edge: prediction.under25.edge,
        recommendation: getRecommendation(prediction.under25.edge)
      })
    } else if (prediction.type === "both_teams_score") {
      valueBets.push({
        market: "btts_yes",
        label: "Les 2 équipes marquent - Oui",
        probability: prediction.yes.probability,
        fairOdds: prediction.yes.odds,
        bookmakerOdds: prediction.yes.bookmakerOdds,
        edge: prediction.yes.edge,
        recommendation: getRecommendation(prediction.yes.edge)
      })
      valueBets.push({
        market: "btts_no",
        label: "Les 2 équipes marquent - Non",
        probability: prediction.no.probability,
        fairOdds: prediction.no.odds,
        bookmakerOdds: prediction.no.bookmakerOdds,
        edge: prediction.no.edge,
        recommendation: getRecommendation(prediction.no.edge)
      })
    }
  })

  // Sort by edge (descending)
  const sortedBets = valueBets
    .filter(bet => bet.edge !== undefined && bet.bookmakerOdds !== undefined)
    .sort((a, b) => (b.edge ?? 0) - (a.edge ?? 0))

  const strongBets = sortedBets.filter(bet => bet.recommendation === "strong")
  const moderateBets = sortedBets.filter(bet => bet.recommendation === "moderate")
  const avoidBets = sortedBets.filter(bet => bet.recommendation === "avoid")

  return (
    <div className="p-4 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{strongBets.length}</div>
          <div className="text-xs text-green-600 font-medium">Paris recommandés</div>
        </div>
        <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-700">{moderateBets.length}</div>
          <div className="text-xs text-yellow-600 font-medium">Paris modérés</div>
        </div>
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-700">{avoidBets.length}</div>
          <div className="text-xs text-red-600 font-medium">Paris à éviter</div>
        </div>
      </div>

      {/* Strong Value Bets */}
      {strongBets.length > 0 && (
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold">Paris fortement recommandés (Edge {">"}5%)</h3>
          </div>
          <div className="space-y-2">
            {strongBets.map((bet, idx) => (
              <ValueBetCard key={idx} bet={bet} />
            ))}
          </div>
        </div>
      )}

      {/* Moderate Value Bets */}
      {moderateBets.length > 0 && (
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold">Paris modérés (Edge 2-5%)</h3>
          </div>
          <div className="space-y-2">
            {moderateBets.map((bet, idx) => (
              <ValueBetCard key={idx} bet={bet} />
            ))}
          </div>
        </div>
      )}

      {/* Avoid Bets */}
      {avoidBets.length > 0 && (
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold">Paris à éviter (Edge négatif)</h3>
          </div>
          <div className="space-y-2">
            {avoidBets.slice(0, 5).map((bet, idx) => (
              <ValueBetCard key={idx} bet={bet} />
            ))}
          </div>
        </div>
      )}

      {/* No Value Bets */}
      {sortedBets.length === 0 && (
        <div className="bg-card border rounded-lg p-6">
          <div className="text-center space-y-4 py-8">
            <h3 className="text-lg font-semibold">Aucun pari avec cotes bookmaker</h3>
            <p className="text-sm text-muted-foreground">
              Les cotes des bookmakers ne sont pas disponibles pour analyser la value.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function ValueBetCard({ bet }: { bet: ValueBet }) {
  const edgePercent = (bet.edge ?? 0) * 100
  const isPositive = edgePercent > 0

  return (
    <div
      className={cn(
        "p-4 rounded-lg border-2 transition-all",
        bet.recommendation === "strong" ? "border-green-500 bg-green-50" :
        bet.recommendation === "moderate" ? "border-yellow-500 bg-yellow-50" :
        "border-red-500 bg-red-50"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
            <span className="font-semibold">{bet.label}</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <div className="text-muted-foreground">Probabilité</div>
              <div className="font-semibold">{(bet.probability * 100).toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-muted-foreground">Cote juste</div>
              <div className="font-semibold">{bet.fairOdds.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Bookmaker</div>
              <div className="font-semibold">{bet.bookmakerOdds?.toFixed(2) ?? "N/A"}</div>
            </div>
          </div>
        </div>
        <div className={cn(
          "ml-4 px-3 py-1 rounded-full text-sm font-bold",
          isPositive
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        )}>
          {isPositive ? "+" : ""}{edgePercent.toFixed(1)}%
        </div>
      </div>
    </div>
  )
}

function getRecommendation(edge?: number): "strong" | "moderate" | "avoid" | "neutral" {
  if (edge === undefined) return "neutral"
  if (edge > 0.05) return "strong"
  if (edge > 0.02) return "moderate"
  return "avoid"
}
