"use client"

import { useState } from "react"
import { cn } from "@/shared/utils"
import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity"
import type { PredictionData, MatchResultPrediction } from "@/core/entities/predictions/prediction.entity"
import { MatchResultCard, OverUnderCard, BTTSCard, CorrectScoreCard, HtFtCard } from "./prediction-cards"
import { ModelNarration } from "./model-narration"
import { Grid, Layers, LayoutGrid, Target, Clock } from "lucide-react"

interface PredictionsTabProps {
  match: MatchDetail
  predictions?: PredictionData[]
}

type MarketType =
  | "match_result"
  | "both_teams_score"
  | "over_under"
  | "correct_score"
  | "ht_ft"

interface MarketCategory {
  id: MarketType
  label: string
  icon: React.ReactNode
}

const marketCategories: MarketCategory[] = [
  { id: "match_result", label: "Résultat (1N2)", icon: <Grid size={16} /> },
  { id: "over_under", label: "Total Buts", icon: <Layers size={16} /> },
  { id: "both_teams_score", label: "Les 2 Marquent", icon: <Target size={16} /> },
  { id: "correct_score", label: "Score Exact", icon: <LayoutGrid size={16} /> },
  { id: "ht_ft", label: "Mi-temps / Fin", icon: <Clock size={16} /> },
]

export function PredictionsTab({ match, predictions }: PredictionsTabProps) {
  const [selectedType, setSelectedType] = useState<MarketType>("match_result")

  const prediction = predictions?.find(p => p.type === selectedType)
  const hasProbabilities = !!match.probabilities

  const renderNoData = (message: string) => (
    <div className="bg-card border rounded-2xl p-8 text-center">
       <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
         <Layers className="text-muted-foreground w-6 h-6" />
       </div>
       <h3 className="text-lg font-bold text-foreground mb-2">Données indisponibles</h3>
       <p className="text-sm text-muted-foreground max-w-xs mx-auto">{message}</p>
    </div>
  )

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto animation-fade-in">
      
      {/* 1. Market Category Selector */}
      <div className="flex flax-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {marketCategories.map((type) => {
          const isActive = selectedType === type.id
          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap",
                isActive 
                  ? "bg-[var(--navy)] text-white shadow-md transform scale-105" 
                  : "bg-card border text-muted-foreground hover:bg-muted"
              )}
            >
              {type.icon}
              {type.label}
            </button>
          )
        })}
      </div>

      {/* 2. Main Market Content */}
      <div className="min-h-[300px]">
        {selectedType === "ht_ft" ? (
          match.htFtProbabilities ? (
            <HtFtCard match={match} data={match.htFtProbabilities} />
          ) : (
            renderNoData("Les probabilités Mi-temps / Fin de match ne sont pas disponibles.")
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
          renderNoData("Probabilités non disponibles pour ce marché.")
        )}
      </div>

    </div>
  )
}
