"use client"

import { useState } from "react"
import { cn } from "@/shared/utils"
import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity"
import type { PredictionData, MatchResultPrediction } from "@/core/entities/predictions/prediction.entity"
import { MatchResultCard, OverUnderCard, BTTSCard, CorrectScoreCard, HtFtCard } from "./prediction-cards"
import { ModelNarration } from "./model-narration"

interface PredictionsTabProps {
  match: MatchDetail
  predictions?: PredictionData[]
}

type PredictionType =
  | "match_result"
  | "both_teams_score"
  | "over_under"
  | "correct_score"
  | "ht_ft"

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
  { id: "ht_ft", label: "Mi-temps / Temps plein", shortLabel: "HT/FT" },
]

/**
 * Onglet Prédictions
 * Affiche un sélecteur de type de prédiction et la card correspondante
 */
export function PredictionsTab({ match, predictions }: PredictionsTabProps) {
  const [selectedType, setSelectedType] = useState<PredictionType>("match_result")

  const prediction = predictions?.find(p => p.type === selectedType)
  const hasProbabilities = !!match.probabilities

  const renderNoData = (message: string) => (
    <div className="bg-card border rounded-lg p-6">
      <div className="text-center space-y-4 py-8">
        <h3 className="text-lg font-semibold">Aucune prédiction disponible</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )

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
                    ? "bg-[var(--navy)] text-white shadow-md scale-105"
                    : "bg-gray-100 text-muted-foreground hover:bg-gray-200 cursor-pointer"
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
        {/* HT-FT predictions are fetched via dedicated endpoint */}
        {selectedType === "ht_ft" ? (
          match.htFtProbabilities ? (
            <HtFtCard match={match} data={match.htFtProbabilities} />
          ) : (
            renderNoData(
              "Les probabilités Mi-temps / Temps plein ne sont pas encore disponibles pour ce match."
            )
          )
        ) : hasProbabilities ? (
          <>
            {selectedType === "match_result" && (
              <MatchResultCard prediction={prediction as MatchResultPrediction} match={match} />
            )}
            {selectedType === "over_under" && <OverUnderCard match={match} />}
            {selectedType === "both_teams_score" && <BTTSCard match={match} />}
            {selectedType === "correct_score" && <CorrectScoreCard match={match} />}
          </>
        ) : prediction && selectedType === "match_result" ? (
          <MatchResultCard prediction={prediction as MatchResultPrediction} match={match} />
        ) : (
          renderNoData(
            "Les probabilités pour ce match ne sont pas encore disponibles. Cela peut arriver pour certaines compétitions ou des rencontres très anciennes."
          )
        )}
      </div>

      <ModelNarration match={match} prediction={prediction} predictions={predictions} />
    </div>
  )
}
