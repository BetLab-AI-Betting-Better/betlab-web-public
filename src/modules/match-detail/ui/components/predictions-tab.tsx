"use client"

import { useState } from "react"
import { cn } from "@/shared/utils"
import type { MatchDetail } from "@/modules/match-detail/domain/types"
import type { PredictionData } from "@/modules/predictions/domain/types"
import { MatchResultCard, OverUnderCard, BTTSCard, CorrectScoreCard } from "./prediction-cards"

interface PredictionsTabProps {
  match: MatchDetail
  predictions?: PredictionData[]
}

type PredictionType =
  | "match_result"
  | "both_teams_score"
  | "over_under"
  | "correct_score"

interface PredictionTypeInfo {
  id: PredictionType
  label: string
  shortLabel: string
}

const predictionTypes: PredictionTypeInfo[] = [
  { id: "match_result", label: "Résultat du match", shortLabel: "1X2" },
  { id: "both_teams_score", label: "Les 2 équipes marquent", shortLabel: "BTTS" },
  { id: "over_under", label: "Plus/Moins de buts", shortLabel: "O/U" },
  { id: "correct_score", label: "Score exact", shortLabel: "Score" },
]

/**
 * Onglet Prédictions
 * Affiche un sélecteur de type de prédiction et la card correspondante
 */
export function PredictionsTab({ match, predictions }: PredictionsTabProps) {
  const [selectedType, setSelectedType] = useState<PredictionType>("match_result")

  const prediction = predictions?.find(p => p.type === selectedType)
  const hasProbabilities = !!match.probabilities

  return (
    <div className="space-y-6 p-4">
      {/* Type Selector - Horizontal scrollable tabs */}
      <div className="relative -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2">
          {predictionTypes.map((type) => {
            const isActive = selectedType === type.id

            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={cn(
                  // Layout & sizing
                  "flex-shrink-0 px-4 py-2 rounded-lg",
                  "min-h-[44px] flex items-center justify-center",
                  // Typography
                  "text-sm font-medium whitespace-nowrap",
                  // Transitions
                  "transition-all duration-200",
                  // Active state
                  isActive
                    ? "bg-[var(--navy)] dark:bg-[var(--lime)] text-white dark:text-[var(--navy)] shadow-md scale-105"
                    : "bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                )}
              >
                {type.shortLabel}
              </button>
            )
          })}
        </div>
      </div>

      {/* Prediction Content */}
      <div>
        {/* Prediction Cards - Use probabilities data from BetLab API */}
        {hasProbabilities ? (
          <>
            {selectedType === "match_result" && (
              <MatchResultCard prediction={prediction as any} match={match} />
            )}
            {selectedType === "over_under" && (
              <OverUnderCard match={match} />
            )}
            {selectedType === "both_teams_score" && (
              <BTTSCard match={match} />
            )}
            {selectedType === "correct_score" && (
              <CorrectScoreCard match={match} />
            )}
          </>
        ) : (
          /* Fallback to legacy predictions */
          <>
            {prediction && selectedType === "match_result" && (
              <MatchResultCard prediction={prediction as any} match={match} />
            )}
            {!prediction && (
              <div className="bg-card border rounded-lg p-6">
                <div className="text-center space-y-4 py-8">
                  <h3 className="text-lg font-semibold">
                    Aucune prédiction disponible
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Les probabilités pour ce match ne sont pas encore disponibles.
                    Cela peut arriver pour les ligues non-européennes ou les matchs très anciens.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
