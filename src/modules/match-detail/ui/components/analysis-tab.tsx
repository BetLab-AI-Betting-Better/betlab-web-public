"use client"

import { cn } from "@/shared/utils"
import type { MatchDetail } from "@/modules/match-detail/domain/types"
import type { MatchResultPrediction } from "@/modules/predictions/domain/types"
import { TrendingUp, Heart, Shield, Clock, Zap, Users } from "lucide-react"

interface AnalysisTabProps {
  match: MatchDetail
  prediction?: MatchResultPrediction
}

/**
 * Onglet d'analyse avancée avec toutes les statistiques enrichies
 */
export function AnalysisTab({ match, prediction }: AnalysisTabProps) {
  if (!prediction?.analytics) {
    return (
      <div className="p-4">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Analyse indisponible</h3>
          <p className="text-muted-foreground">
            Les données d'analyse avancée ne sont pas disponibles pour ce match.
          </p>
        </div>
      </div>
    )
  }

  const { analytics } = prediction

  return (
    <div className="p-4 space-y-6">
      {/* Expected Goals */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-[var(--navy)] dark:text-[var(--lime)]" />
          <h3 className="text-lg font-semibold">Expected Goals (xG)</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Home xG */}
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">{match.homeTeam.name}</div>
            <div className="text-3xl font-bold text-[var(--navy)] dark:text-[var(--lime)]">
              {prediction.xG.home.toFixed(2)}
            </div>
            {prediction.xG_recent && (
              <div className="text-xs text-muted-foreground">
                Récent: {prediction.xG_recent.home.toFixed(2)}
              </div>
            )}
          </div>

          {/* Away xG */}
          <div className="space-y-2 text-right">
            <div className="text-sm text-muted-foreground">{match.awayTeam.name}</div>
            <div className="text-3xl font-bold text-[var(--navy)] dark:text-[var(--lime)]">
              {prediction.xG.away.toFixed(2)}
            </div>
            {prediction.xG_recent && (
              <div className="text-xs text-muted-foreground">
                Récent: {prediction.xG_recent.away.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Comparison */}
      {analytics.formIndex && (
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[var(--navy)] dark:text-[var(--lime)]" />
            <h3 className="text-lg font-semibold">Forme récente</h3>
          </div>
          <div className="space-y-4">
            {/* Home Form */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{match.homeTeam.name}</span>
                <span className={cn(
                  "text-sm font-bold",
                  analytics.formIndex.home > 0.3 ? "text-green-600 dark:text-green-400" :
                  analytics.formIndex.home < -0.3 ? "text-red-600 dark:text-red-400" :
                  "text-yellow-600 dark:text-yellow-400"
                )}>
                  {analytics.formIndex.home > 0 ? "+" : ""}{(analytics.formIndex.home * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    analytics.formIndex.home > 0 ? "bg-green-500" : "bg-red-500"
                  )}
                  style={{ width: `${Math.abs(analytics.formIndex.home) * 100}%` }}
                />
              </div>
            </div>

            {/* Away Form */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{match.awayTeam.name}</span>
                <span className={cn(
                  "text-sm font-bold",
                  analytics.formIndex.away > 0.3 ? "text-green-600 dark:text-green-400" :
                  analytics.formIndex.away < -0.3 ? "text-red-600 dark:text-red-400" :
                  "text-yellow-600 dark:text-yellow-400"
                )}>
                  {analytics.formIndex.away > 0 ? "+" : ""}{(analytics.formIndex.away * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    analytics.formIndex.away > 0 ? "bg-green-500" : "bg-red-500"
                  )}
                  style={{ width: `${Math.abs(analytics.formIndex.away) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Ratings (ELO) */}
      {analytics.ratings && (
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[var(--navy)] dark:text-[var(--lime)]" />
            <h3 className="text-lg font-semibold">Ratings ELO</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Home Rating */}
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">{match.homeTeam.name}</div>
              <div className="text-2xl font-bold">{Math.round(analytics.ratings.home)}</div>
            </div>

            {/* Away Rating */}
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">{match.awayTeam.name}</div>
              <div className="text-2xl font-bold">{Math.round(analytics.ratings.away)}</div>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-muted-foreground">
            Différence: {Math.abs(Math.round(analytics.ratings.home - analytics.ratings.away))} points
            {analytics.ratings.home > analytics.ratings.away ? ` en faveur de ${match.homeTeam.name}` : ` en faveur de ${match.awayTeam.name}`}
          </div>
        </div>
      )}

      {/* Injuries */}
      {analytics.injuryFactor && (
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-[var(--navy)] dark:text-[var(--lime)]" />
            <h3 className="text-lg font-semibold">Disponibilité des joueurs</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Home Availability */}
            <div>
              <div className="text-sm text-muted-foreground mb-2">{match.homeTeam.name}</div>
              <div className="text-2xl font-bold mb-2">
                {(analytics.injuryFactor.home * 100).toFixed(0)}%
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    analytics.injuryFactor.home > 0.8 ? "bg-green-500" :
                    analytics.injuryFactor.home > 0.6 ? "bg-yellow-500" :
                    "bg-red-500"
                  )}
                  style={{ width: `${analytics.injuryFactor.home * 100}%` }}
                />
              </div>
            </div>

            {/* Away Availability */}
            <div>
              <div className="text-sm text-muted-foreground mb-2">{match.awayTeam.name}</div>
              <div className="text-2xl font-bold mb-2">
                {(analytics.injuryFactor.away * 100).toFixed(0)}%
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    analytics.injuryFactor.away > 0.8 ? "bg-green-500" :
                    analytics.injuryFactor.away > 0.6 ? "bg-yellow-500" :
                    "bg-red-500"
                  )}
                  style={{ width: `${analytics.injuryFactor.away * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fatigue & Rest */}
      {analytics.fatigue && (
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-[var(--navy)] dark:text-[var(--lime)]" />
            <h3 className="text-lg font-semibold">Repos et fatigue</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Home Rest */}
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">{match.homeTeam.name}</div>
              <div className="text-2xl font-bold mb-1">
                {(analytics.fatigue.restHours.home / 24).toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">jours de repos</div>
              <div className="mt-2 text-xs">
                Facteur fatigue: {(analytics.fatigue.fatigueFactors.home * 100).toFixed(0)}%
              </div>
            </div>

            {/* Away Rest */}
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">{match.awayTeam.name}</div>
              <div className="text-2xl font-bold mb-1">
                {(analytics.fatigue.restHours.away / 24).toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">jours de repos</div>
              <div className="mt-2 text-xs">
                Facteur fatigue: {(analytics.fatigue.fatigueFactors.away * 100).toFixed(0)}%
              </div>
            </div>
          </div>
          {analytics.fatigue.travelDistance !== undefined && analytics.fatigue.travelDistance > 0 && (
            <div className="mt-4 text-center text-xs text-muted-foreground">
              Distance de déplacement: {analytics.fatigue.travelDistance.toFixed(0)} km
            </div>
          )}
        </div>
      )}

      {/* Defense Factors */}
      {analytics.defenseFactor && (
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[var(--navy)] dark:text-[var(--lime)]" />
            <h3 className="text-lg font-semibold">Force défensive</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">{match.homeTeam.name}</div>
              <div className="text-2xl font-bold">{(analytics.defenseFactor.home * 100).toFixed(0)}%</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">{match.awayTeam.name}</div>
              <div className="text-2xl font-bold">{(analytics.defenseFactor.away * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Head to Head */}
      {analytics.headToHead && (
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[var(--navy)] dark:text-[var(--lime)]" />
            <h3 className="text-lg font-semibold">Historique des confrontations</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm">Biais H2H</span>
              <span className="font-semibold">{(analytics.headToHead.bias * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm">Écart moyen de buts</span>
              <span className="font-semibold">{analytics.headToHead.goalDelta.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
