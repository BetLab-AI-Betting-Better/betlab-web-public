"use client"

import { Target } from "lucide-react"
import { cn } from "@/shared/utils"
import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity"

interface OverUnderCardProps {
  match: MatchDetail
}

const confidenceVariants = {
  high: { className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Confiance élevée" },
  medium: { className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", label: "Confiance moyenne" },
  low: { className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Confiance faible" },
}

/**
 * Card de prédiction pour Over/Under buts
 * Utilise les données de probabilités de l'API BetLab
 */
export function OverUnderCard({ match }: OverUnderCardProps) {
  const probabilities = match.probabilities

  if (!probabilities) {
    return (
      <div className="overflow-hidden border rounded-lg bg-card">
        <div className="p-6">
          <div className="text-center space-y-4 py-8">
            <h3 className="text-lg font-semibold">Données non disponibles</h3>
            <p className="text-sm text-muted-foreground">
              Les probabilités Over/Under ne sont pas disponibles pour ce match.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { over_under } = probabilities.markets

  const overPerc25 = over_under.over_2_5 * 100
  const underPerc25 = over_under.under_2_5 * 100
  const bestChoice = overPerc25 > underPerc25 ? "over" : "under"

  // Determine confidence level based on probability difference
  const difference = Math.abs(overPerc25 - underPerc25)
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
            <h3 className="text-lg font-semibold">Plus/Moins 2.5 Buts</h3>
          </div>
          <span className={cn("px-3 py-1 rounded-full text-xs font-medium", confidenceConfig.className)}>
            {confidenceConfig.label}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Over 2.5 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Plus de 2.5 buts</span>
            <span className="font-bold text-lg">{overPerc25.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${overPerc25}%` }}
            />
          </div>
        </div>

        {/* Under 2.5 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Moins de 2.5 buts</span>
            <span className="font-bold text-lg">{underPerc25.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${underPerc25}%` }}
            />
          </div>
        </div>

        {/* Other thresholds */}
        <div className="space-y-3 pt-4 border-t">
          <div className="text-sm font-medium text-muted-foreground">Autres seuils</div>
          <div className="grid grid-cols-2 gap-3">
            {/* Over/Under 1.5 */}
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground mb-2">Plus de 1.5</div>
              <div className="text-lg font-bold">{(over_under.over_1_5 * 100).toFixed(1)}%</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground mb-2">Moins de 1.5</div>
              <div className="text-lg font-bold">{(over_under.under_1_5 * 100).toFixed(1)}%</div>
            </div>

            {/* Over/Under 3.5 */}
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground mb-2">Plus de 3.5</div>
              <div className="text-lg font-bold">{(over_under.over_3_5 * 100).toFixed(1)}%</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground mb-2">Moins de 3.5</div>
              <div className="text-lg font-bold">{(over_under.under_3_5 * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between p-3 bg-[var(--lime)]/10 dark:bg-[var(--lime)]/5 rounded-lg">
            <span className="text-sm font-medium">Meilleur pari</span>
            <span className="text-sm font-bold text-[var(--navy)] dark:text-[var(--lime)]">
              {bestChoice === "over" ? "Plus de 2.5 buts" : "Moins de 2.5 buts"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
