"use client"

import { Trophy } from "lucide-react"
import { cn } from "@/shared/utils"
import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity"
import type { MatchResultPrediction } from "@/core/entities/predictions/prediction.entity"

interface MatchResultCardProps {
  prediction: MatchResultPrediction
  match: MatchDetail
}

const confidenceVariants = {
  high: { className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", label: "Confiance élevée" },
  medium: { className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", label: "Confiance moyenne" },
  low: { className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", label: "Confiance faible" },
}

/**
 * Card de prédiction pour le résultat du match (1X2)
 * Affiche les probabilités pour Home Win, Draw, Away Win
 */
export function MatchResultCard({ prediction, match }: MatchResultCardProps) {
  const { homeWin, draw, awayWin, confidence, reasoning, xG } = prediction
  const confidenceConfig = confidenceVariants[confidence]

  return (
    <div className="overflow-hidden border rounded-lg bg-card">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[var(--navy)] dark:text-[var(--lime)]" />
            <h3 className="text-lg font-semibold">Résultat du match</h3>
          </div>
          <span className={cn("px-3 py-1 rounded-full text-xs font-medium", confidenceConfig.className)}>
            {confidenceConfig.label}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* xG Display */}
        {xG && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="text-center flex-1">
              <div className="text-xs text-muted-foreground mb-1">xG Domicile</div>
              <div className="text-lg font-bold">{xG.home.toFixed(2)}</div>
            </div>
            <div className="text-xs text-muted-foreground">vs</div>
            <div className="text-center flex-1">
              <div className="text-xs text-muted-foreground mb-1">xG Extérieur</div>
              <div className="text-lg font-bold">{xG.away.toFixed(2)}</div>
            </div>
          </div>
        )}

        {/* Home Win */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">{match.homeTeam.name} gagne</span>
            <span className="font-bold text-lg">{(homeWin.probability * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className={cn(
                "h-full bg-[var(--lime)] transition-all duration-500",
                homeWin.probability > 0.5 && "bg-[var(--lime)]"
              )}
              style={{ width: `${homeWin.probability * 100}%` }}
            />
          </div>
          {homeWin.odds && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Cote juste</span>
              <span className="text-sm font-semibold text-[var(--navy)] dark:text-[var(--lime)]">
                {homeWin.odds.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Draw */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Match nul</span>
            <span className="font-bold text-lg">{(draw.probability * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className={cn(
                "h-full bg-[var(--lime)] transition-all duration-500",
                draw.probability > 0.5 && "bg-[var(--lime)]"
              )}
              style={{ width: `${draw.probability * 100}%` }}
            />
          </div>
          {draw.odds && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Cote juste</span>
              <span className="text-sm font-semibold text-[var(--navy)] dark:text-[var(--lime)]">
                {draw.odds.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Away Win */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">{match.awayTeam.name} gagne</span>
            <span className="font-bold text-lg">{(awayWin.probability * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className={cn(
                "h-full bg-[var(--lime)] transition-all duration-500",
                awayWin.probability > 0.5 && "bg-[var(--lime)]"
              )}
              style={{ width: `${awayWin.probability * 100}%` }}
            />
          </div>
          {awayWin.odds && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Cote juste</span>
              <span className="text-sm font-semibold text-[var(--navy)] dark:text-[var(--lime)]">
                {awayWin.odds.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Reasoning */}
        {reasoning && (
          <div className="mt-4 p-4 bg-muted rounded-lg border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {reasoning}
            </p>
          </div>
        )}

        {/* Best Bet */}
        <div className="pt-4 border-t">
          {homeWin.probability > draw.probability &&
            homeWin.probability > awayWin.probability && (
              <div className="flex items-center justify-between p-3 bg-[var(--lime)]/10 dark:bg-[var(--lime)]/5 rounded-lg">
                <span className="text-sm font-medium">Meilleur pari</span>
                <span className="text-sm font-bold text-[var(--navy)] dark:text-[var(--lime)]">
                  {match.homeTeam.name} gagne
                </span>
              </div>
            )}
          {draw.probability > homeWin.probability &&
            draw.probability > awayWin.probability && (
              <div className="flex items-center justify-between p-3 bg-[var(--lime)]/10 dark:bg-[var(--lime)]/5 rounded-lg">
                <span className="text-sm font-medium">Meilleur pari</span>
                <span className="text-sm font-bold text-[var(--navy)] dark:text-[var(--lime)]">
                  Match nul
                </span>
              </div>
            )}
          {awayWin.probability > homeWin.probability &&
            awayWin.probability > draw.probability && (
              <div className="flex items-center justify-between p-3 bg-[var(--lime)]/10 dark:bg-[var(--lime)]/5 rounded-lg">
                <span className="text-sm font-medium">Meilleur pari</span>
                <span className="text-sm font-bold text-[var(--navy)] dark:text-[var(--lime)]">
                  {match.awayTeam.name} gagne
                </span>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
