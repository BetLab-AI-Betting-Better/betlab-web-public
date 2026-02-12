"use client"

import { useState } from "react"
import { cn } from "@/shared/utils"
import type { MatchDetailVM } from "@/application/view-models/match-detail/match-detail.vm"
import { MatchResultCard, OverUnderCard, BTTSCard, CorrectScoreCard, HtFtCard } from "./prediction-cards"
import { Grid, Layers, LayoutGrid, Target, Clock } from "lucide-react"

interface PredictionsTabProps {
  vm: MatchDetailVM
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
  { id: "match_result", label: "Resultat (1N2)", icon: <Grid size={16} /> },
  { id: "over_under", label: "Total buts", icon: <Layers size={16} /> },
  { id: "both_teams_score", label: "Les 2 marquent", icon: <Target size={16} /> },
  { id: "correct_score", label: "Score exact", icon: <LayoutGrid size={16} /> },
  { id: "ht_ft", label: "Mi-temps / Fin", icon: <Clock size={16} /> },
]

export function PredictionsTab({ vm }: PredictionsTabProps) {
  const [selectedType, setSelectedType] = useState<MarketType>("match_result")

  const renderNoData = (message: string) => (
    <div className="bg-card border rounded-2xl p-8 text-center">
      <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
        <Layers className="text-muted-foreground w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">Donnees indisponibles</h3>
      <p className="text-sm text-muted-foreground max-w-xs mx-auto">{message}</p>
    </div>
  )

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto animation-fade-in">
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

      <div className="min-h-[300px]">
        {selectedType === "ht_ft" ? (
          vm.cards.htFt.available ? (
            <HtFtCard vm={vm.cards.htFt} />
          ) : (
            renderNoData("Les probabilites Mi-temps / Fin ne sont pas disponibles.")
          )
        ) : selectedType === "match_result" ? (
          vm.cards.matchResult.available ? (
            <MatchResultCard vm={vm.cards.matchResult} />
          ) : (
            renderNoData("Les probabilites 1N2 ne sont pas disponibles.")
          )
        ) : selectedType === "over_under" ? (
          vm.cards.overUnder.available ? (
            <OverUnderCard vm={vm.cards.overUnder} />
          ) : (
            renderNoData("Les probabilites Over/Under ne sont pas disponibles.")
          )
        ) : selectedType === "both_teams_score" ? (
          vm.cards.btts.available ? (
            <BTTSCard vm={vm.cards.btts} />
          ) : (
            renderNoData("Les probabilites BTTS ne sont pas disponibles.")
          )
        ) : selectedType === "correct_score" ? (
          vm.cards.correctScore.available ? (
            <CorrectScoreCard vm={vm.cards.correctScore} />
          ) : (
            renderNoData("Les probabilites Score exact ne sont pas disponibles.")
          )
        ) : (
          renderNoData("Probabilites non disponibles pour ce marche.")
        )}
      </div>
    </div>
  )
}
