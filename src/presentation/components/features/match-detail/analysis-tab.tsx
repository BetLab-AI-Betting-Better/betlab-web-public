"use client"

import { cn } from "@/shared/utils"
import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity"
import type { MatchResultPrediction, AsianHandicapPrediction, AsianTotalsPrediction, ExactGoalsPrediction } from "@/core/entities/predictions/prediction.entity"
import { TrendingUp, Heart, Shield, Clock, Zap, Users, Info } from "lucide-react"
import { OpportunitiesList } from "./smart-analysis/opportunities"
import { GoalsHeatmap } from "./smart-analysis/goals-heatmap"
import { AsianMarketsSummary } from "./smart-analysis/asian-markets"

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
            Les données d&apos;analyse avancée ne sont pas disponibles pour ce match.
          </p>
        </div>
      </div>
    )
  }

  const { analytics } = prediction

  // Extract other prediction types from match
  const asianHandicap = match.predictions?.find(p => p.type === "asian_handicap") as AsianHandicapPrediction
  const asianTotals = match.predictions?.find(p => p.type === "asian_totals") as AsianTotalsPrediction
  const exactGoals = match.predictions?.find(p => p.type === "exact_goals") as ExactGoalsPrediction

  return (
    <div className="p-4 space-y-8 max-w-4xl mx-auto">
      {/* 0. Model Narration (New) */}
      <ModelNarration match={match} prediction={prediction} predictions={match.predictions} />

      {/* 1. Opportunities & Golden Picks */}
      <OpportunitiesList opportunities={analytics.opportunities || []} />

      {/* 2. Analysis & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expected Goals */}
        <div className="bg-card border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-[var(--navy)]" />
            <h3 className="text-lg font-semibold">Expected Goals (xG)</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Home xG */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">{match.homeTeam.name}</div>
              <div className="text-3xl font-bold text-[var(--navy)]">
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
              <div className="text-3xl font-bold text-[var(--navy)]">
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
              <TrendingUp className="w-5 h-5 text-[var(--navy)]" />
              <h3 className="text-lg font-semibold">Forme récente</h3>
            </div>
            <div className="space-y-4">
              {/* Home Form */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{match.homeTeam.name}</span>
                  <span className={cn(
                    "text-sm font-bold",
                    analytics.formIndex.home > 0.3 ? "text-green-600" :
                      analytics.formIndex.home < -0.3 ? "text-red-600" :
                        "text-yellow-600"
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
                    analytics.formIndex.away > 0.3 ? "text-green-600" :
                      analytics.formIndex.away < -0.3 ? "text-red-600" :
                        "text-yellow-600"
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
              <Users className="w-5 h-5 text-[var(--navy)]" />
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
              <Heart className="w-5 h-5 text-[var(--navy)]" />
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
              <Clock className="w-5 h-5 text-[var(--navy)]" />
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
              <Shield className="w-5 h-5 text-[var(--navy)]" />
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
              <Users className="w-5 h-5 text-[var(--navy)]" />
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

      {/* 3. Market Distribution (New V2.1 Sections) */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <Info className="w-5 h-5 text-[var(--navy)]" />
          <h3 className="text-lg font-bold text-[var(--navy)] uppercase tracking-tight">Analyse de Marché Avancée</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exactGoals && <GoalsHeatmap distribution={exactGoals.distribution} />}
          {exactGoals && (
            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 bg-[var(--navy-ultra-light)] border-b">
                <h3 className="font-bold text-[var(--navy)] uppercase tracking-tight text-sm">Brackets de Buts</h3>
              </div>
              <div className="p-4 space-y-4">
                {exactGoals.brackets.map((b, i) => (
                  <div key={i} className="flex justify-between items-center bg-muted/30 p-3 rounded-lg">
                    <span className="font-bold text-[var(--navy)]">{b.bracket} buts</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black">{(b.probability * 100).toFixed(1)}%</span>
                      <div className="w-16 bg-muted h-1 rounded-full overflow-hidden">
                        <div className="bg-[var(--navy)] h-full" style={{ width: `${b.probability * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {asianHandicap && <AsianMarketsSummary type="Handicap" lines={asianHandicap.lines} />}
          {asianTotals && <AsianMarketsSummary type="Total" lines={asianTotals.lines} />}
        </div>
      </div>
    </div>
  )
}
