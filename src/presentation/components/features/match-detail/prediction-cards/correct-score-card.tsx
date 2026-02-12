"use client"

import { Hash } from "lucide-react"
import { cn } from "@/shared/utils"
import type { CorrectScoreCardVM } from "@/application/view-models/match-detail/prediction-cards.vm"

interface CorrectScoreCardProps {
  vm: CorrectScoreCardVM
}

export function CorrectScoreCard({ vm }: CorrectScoreCardProps) {
  if (!vm.available) {
    return (
      <div className="overflow-hidden border rounded-lg bg-card">
        <div className="p-6">
          <div className="text-center space-y-4 py-8">
            <h3 className="text-lg font-semibold">Donnees non disponibles</h3>
            <p className="text-sm text-muted-foreground">
              Les probabilites de score exact ne sont pas disponibles pour ce match.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const topScores = vm.topScores
  const mostLikely = vm.mostLikely || "0-0"

  return (
    <div className="overflow-hidden border rounded-lg bg-card">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-[var(--navy)]" />
            <h3 className="text-lg font-semibold">{vm.title}</h3>
          </div>
          {vm.confidence && (
            <span className={cn("px-3 py-1 rounded-full text-xs font-medium", vm.confidence.className)}>
              {vm.confidence.label}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="text-center p-6 bg-[var(--lime)]/10 rounded-lg border-2 border-[var(--lime)]">
          <div className="text-xs text-muted-foreground font-medium mb-2">Score le plus probable</div>
          <div className="text-4xl font-bold text-[var(--navy)] mb-2">
            {mostLikely}
          </div>
          <div className="text-sm text-muted-foreground">
            {(topScores[0]?.probability ?? 0).toFixed(1)}% de probabilite
          </div>
        </div>

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
                      <div className="text-sm font-semibold">{score.probability.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground text-center">
            Ces 10 scores representent {vm.topShare.toFixed(1)}% de tous les resultats possibles
          </div>
        </div>
      </div>
    </div>
  )
}
