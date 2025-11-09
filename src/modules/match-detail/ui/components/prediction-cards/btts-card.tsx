"use client"

import { Target } from "lucide-react"
import { cn } from "@/shared/utils"
import type { MatchDetail } from "@/modules/match-detail/domain/types"

interface BTTSCardProps {
  match: MatchDetail
}

const confidenceVariants = {
  high: { className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Confiance élevée" },
  medium: { className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", label: "Confiance moyenne" },
  low: { className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Confiance faible" },
}

/**
 * Card de prédiction pour BTTS (Both Teams To Score)
 * Utilise les données de probabilités de l'API BetLab
 */
export function BTTSCard({ match }: BTTSCardProps) {
  const probabilities = match.probabilities

  if (!probabilities) {
    return (
      <div className="overflow-hidden border rounded-lg bg-card">
        <div className="p-6">
          <div className="text-center space-y-4 py-8">
            <h3 className="text-lg font-semibold">Données non disponibles</h3>
            <p className="text-sm text-muted-foreground">
              Les probabilités BTTS ne sont pas disponibles pour ce match.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { btts } = probabilities.markets
  const bttsOdds = probabilities.implied_odds.btts

  const yesPerc = btts.yes * 100
  const noPerc = btts.no * 100
  const bestChoice = yesPerc > noPerc

  // Determine confidence level based on probability difference
  const difference = Math.abs(yesPerc - noPerc)
  let confidence: "high" | "medium" | "low"
  if (difference > 30) confidence = "high"
  else if (difference > 15) confidence = "medium"
  else confidence = "low"

  const confidenceConfig = confidenceVariants[confidence]

  return (
    <div className="overflow-hidden border rounded-lg bg-card">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[var(--navy)] dark:text-[var(--lime)]" />
            <h3 className="text-lg font-semibold">Les 2 équipes marquent</h3>
          </div>
          <span className={cn("px-3 py-1 rounded-full text-xs font-medium", confidenceConfig.className)}>
            {confidenceConfig.label}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* BTTS Yes/No Options */}
        <div className="grid grid-cols-2 gap-3">
          {/* Yes */}
          <div
            className={cn(
              "p-4 rounded-lg border-2 transition-all",
              bestChoice
                ? "border-[var(--lime)] bg-[var(--lime)]/10"
                : "border-border bg-muted/50"
            )}
          >
            <div className="text-center space-y-2">
              <div className="text-xs text-muted-foreground font-medium">OUI</div>
              <div className="text-2xl font-bold">{yesPerc.toFixed(1)}%</div>
              <div className="pt-2 border-t space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Cote juste</span>
                  <span className="font-semibold">{bttsOdds.yes.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* No */}
          <div
            className={cn(
              "p-4 rounded-lg border-2 transition-all",
              !bestChoice
                ? "border-[var(--navy)] bg-[var(--navy)]/10"
                : "border-border bg-muted/50"
            )}
          >
            <div className="text-center space-y-2">
              <div className="text-xs text-muted-foreground font-medium">NON</div>
              <div className="text-2xl font-bold">{noPerc.toFixed(1)}%</div>
              <div className="pt-2 border-t space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Cote juste</span>
                  <span className="font-semibold">{bttsOdds.no.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reasoning */}
        <div className="p-4 bg-muted rounded-lg border border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {yesPerc > 50
              ? `Il y a ${yesPerc.toFixed(0)}% de chances que les deux équipes marquent dans ce match. Cela suggère un match ouvert avec des opportunités offensives des deux côtés.`
              : `Il y a ${noPerc.toFixed(0)}% de chances qu'au moins une équipe ne marque pas. Cela suggère que la défense pourrait dominer ou qu'une équipe aura du mal à marquer.`}
          </p>
        </div>

        {/* Recommendation */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between p-3 bg-[var(--lime)]/10 dark:bg-[var(--lime)]/5 rounded-lg">
            <span className="text-sm font-medium">Meilleur pari</span>
            <span className="text-sm font-bold text-[var(--navy)] dark:text-[var(--lime)]">
              BTTS {bestChoice ? "Oui" : "Non"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
