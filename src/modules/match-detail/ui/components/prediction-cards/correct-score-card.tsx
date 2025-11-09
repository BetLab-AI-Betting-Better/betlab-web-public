"use client"

import { Hash } from "lucide-react"
import { cn } from "@/shared/utils"
import type { MatchDetail } from "@/modules/match-detail/domain/types"

interface CorrectScoreCardProps {
  match: MatchDetail
}

const confidenceVariants = {
  high: { className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Confiance élevée" },
  medium: { className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", label: "Confiance moyenne" },
  low: { className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Confiance faible" },
}

/**
 * Card de prédiction pour le score exact
 * Utilise les données de probabilités de l'API BetLab
 */
export function CorrectScoreCard({ match }: CorrectScoreCardProps) {
  const probabilities = match.probabilities

  if (!probabilities) {
    return (
      <div className="overflow-hidden border rounded-lg bg-card">
        <div className="p-6">
          <div className="text-center space-y-4 py-8">
            <h3 className="text-lg font-semibold">Données non disponibles</h3>
            <p className="text-sm text-muted-foreground">
              Les probabilités de score exact ne sont pas disponibles pour ce match.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { correct_score_top } = probabilities.markets
  const topScores = correct_score_top.slice(0, 10)
  const mostLikely = topScores[0]?.score || "0-0"

  // Determine confidence based on top score probability
  const topProb = (topScores[0]?.probability || 0) * 100
  let confidence: "high" | "medium" | "low"
  if (topProb > 20) confidence = "high"
  else if (topProb > 12) confidence = "medium"
  else confidence = "low"

  const confidenceConfig = confidenceVariants[confidence]

  return (
    <div className="overflow-hidden border rounded-lg bg-card">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-[var(--navy)] dark:text-[var(--lime)]" />
            <h3 className="text-lg font-semibold">Score Exact</h3>
          </div>
          <span className={cn("px-3 py-1 rounded-full text-xs font-medium", confidenceConfig.className)}>
            {confidenceConfig.label}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Most Likely Score */}
        <div className="text-center p-6 bg-[var(--lime)]/10 dark:bg-[var(--lime)]/5 rounded-lg border-2 border-[var(--lime)]">
          <div className="text-xs text-muted-foreground font-medium mb-2">Score le plus probable</div>
          <div className="text-4xl font-bold text-[var(--navy)] dark:text-[var(--lime)] mb-2">
            {mostLikely}
          </div>
          <div className="text-sm text-muted-foreground">
            {((topScores[0]?.probability || 0) * 100).toFixed(1)}% de probabilité
          </div>
        </div>

        {/* Top Scores Grid */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground">Top 10 des scores les plus probables</div>
          <div className="grid grid-cols-2 gap-2">
            {topScores.map((score, index) => {
              const isTopScore = index === 0
              return (
                <div
                  key={score.score}
                  className={cn(
                    "p-3 rounded-lg transition-all",
                    isTopScore
                      ? "bg-[var(--lime)]/20 border-2 border-[var(--lime)]"
                      : "bg-muted/50 border border-border hover:bg-muted"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-xs font-medium px-1.5 py-0.5 rounded",
                        isTopScore
                          ? "bg-[var(--lime)] text-[var(--navy)]"
                          : "bg-muted text-muted-foreground"
                      )}>
                        #{index + 1}
                      </span>
                      <span className="text-lg font-bold">{score.score}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{(score.probability * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Score Distribution */}
        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground text-center">
            Ces 10 scores représentent {(topScores.reduce((sum, s) => sum + s.probability, 0) * 100).toFixed(1)}% de tous les résultats possibles
          </div>
        </div>
      </div>
    </div>
  )
}
