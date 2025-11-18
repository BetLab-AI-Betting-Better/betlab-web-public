/**
 * Prediction Card Variants - 8 variantes spécialisées pour différents types de prédictions
 *
 * Chaque variante utilise PredictionCard avec un contenu personnalisé
 */
"use client"

import * as React from "react"
import { cn } from "@/shared/utils"
import { PredictionCard, type PredictionCardProps } from "./prediction-card"
import {
  TrendingUp,
  Target,
  Trophy,
  Clock,
  Shield,
  Flag,
  Percent,
  BarChart3
} from "lucide-react"
import { Progress } from "@/presentation/components/ui/progress"

// ============================================
// 1. Over15Card - Prédiction Over/Under 1.5 buts
// ============================================
interface Over15CardProps extends Omit<PredictionCardProps, 'type' | 'title' | 'icon' | 'children'> {
  overProbability: number
  underProbability: number
  averageGoals: number
  lastMatches: { over15: number; total: number }
}

export function Over15Card({
  overProbability,
  underProbability,
  averageGoals,
  lastMatches,
  ...props
}: Over15CardProps) {
  return (
    <PredictionCard
      {...props}
      type="over15"
      title="Over/Under 1.5 Buts"
      icon={TrendingUp}
    >
      <div className="space-y-4">
        {/* Probabilités */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-emerald-500/10 p-4 text-center">
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Over 1.5
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {overProbability}%
            </p>
          </div>
          <div className="rounded-xl bg-red-500/10 p-4 text-center">
            <p className="text-xs font-medium text-red-600 dark:text-red-400">
              Under 1.5
            </p>
            <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
              {underProbability}%
            </p>
          </div>
        </div>

        {/* Visual progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Probabilité Over</span>
            <span>{overProbability}%</span>
          </div>
          <Progress value={overProbability} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Moyenne de buts</p>
            <p className="mt-1 text-lg font-semibold">{averageGoals}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Derniers matchs</p>
            <p className="mt-1 text-lg font-semibold">
              {lastMatches.over15}/{lastMatches.total} Over
            </p>
          </div>
        </div>
      </div>
    </PredictionCard>
  )
}

// ============================================
// 2. BTTSCard - Both Teams To Score
// ============================================
interface BTTSCardProps extends Omit<PredictionCardProps, 'type' | 'title' | 'icon' | 'children'> {
  bttsYesProbability: number
  bttsNoProbability: number
  homeGoalsAvg: number
  awayGoalsAvg: number
}

export function BTTSCard({
  bttsYesProbability,
  bttsNoProbability,
  homeGoalsAvg,
  awayGoalsAvg,
  ...props
}: BTTSCardProps) {
  return (
    <PredictionCard
      {...props}
      type="btts"
      title="Les Deux Équipes Marquent"
      icon={Target}
    >
      <div className="space-y-4">
        {/* Probabilités */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-blue-500/10 p-4 text-center">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
              BTTS Oui
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
              {bttsYesProbability}%
            </p>
          </div>
          <div className="rounded-xl bg-slate-500/10 p-4 text-center">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              BTTS Non
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-600 dark:text-slate-400">
              {bttsNoProbability}%
            </p>
          </div>
        </div>

        {/* Visual progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Probabilité BTTS</span>
            <span>{bttsYesProbability}%</span>
          </div>
          <Progress value={bttsYesProbability} className="h-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Buts moy. domicile</p>
            <p className="mt-1 text-lg font-semibold">{homeGoalsAvg}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Buts moy. extérieur</p>
            <p className="mt-1 text-lg font-semibold">{awayGoalsAvg}</p>
          </div>
        </div>
      </div>
    </PredictionCard>
  )
}

// ============================================
// 3. ExactScoreCard - Score exact
// ============================================
interface ExactScoreCardProps extends Omit<PredictionCardProps, 'type' | 'title' | 'icon' | 'children'> {
  topScores: Array<{ score: string; probability: number }>
}

export function ExactScoreCard({
  topScores,
  ...props
}: ExactScoreCardProps) {
  return (
    <PredictionCard
      {...props}
      type="exactScore"
      title="Score Exact"
      icon={Trophy}
    >
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Scores les plus probables
        </p>
        {topScores.map((item, index) => (
          <div
            key={item.score}
            className={cn(
              "flex items-center justify-between rounded-lg p-3",
              index === 0 ? "bg-primary/10 border-2 border-primary" : "bg-muted/50"
            )}
          >
            <div className="flex items-center gap-3">
              <span className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                index === 0 ? "bg-primary text-primary-foreground" : "bg-muted"
              )}>
                {index + 1}
              </span>
              <span className="text-2xl font-bold">{item.score}</span>
            </div>
            <span className={cn(
              "text-lg font-semibold",
              index === 0 && "text-primary"
            )}>
              {item.probability}%
            </span>
          </div>
        ))}
      </div>
    </PredictionCard>
  )
}

// ============================================
// 4. HTFTCard - Half Time / Full Time
// ============================================
interface HTFTCardProps extends Omit<PredictionCardProps, 'type' | 'title' | 'icon' | 'children'> {
  predictions: Array<{ label: string; probability: number }>
}

export function HTFTCard({
  predictions,
  ...props
}: HTFTCardProps) {
  return (
    <PredictionCard
      {...props}
      type="htft"
      title="Mi-Temps / Temps Plein"
      icon={Clock}
    >
      <div className="space-y-3">
        {predictions.map((pred, index) => (
          <div key={pred.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{pred.label}</span>
              <span className="text-muted-foreground">{pred.probability}%</span>
            </div>
            <Progress
              value={pred.probability}
              className={cn(
                "h-2",
                index === 0 && "bg-primary/20"
              )}
            />
          </div>
        ))}
      </div>
    </PredictionCard>
  )
}

// ============================================
// 5. HalfCompareCard - Comparaison mi-temps
// ============================================
interface HalfCompareCardProps extends Omit<PredictionCardProps, 'type' | 'title' | 'icon' | 'children'> {
  firstHalfGoals: number
  secondHalfGoals: number
  moreGoalsIn: 'first' | 'second' | 'equal'
  probability: number
}

export function HalfCompareCard({
  firstHalfGoals,
  secondHalfGoals,
  moreGoalsIn,
  probability,
  ...props
}: HalfCompareCardProps) {
  return (
    <PredictionCard
      {...props}
      type="halfCompare"
      title="Comparaison Mi-Temps"
      icon={BarChart3}
    >
      <div className="space-y-4">
        {/* Visual comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className={cn(
            "rounded-xl p-4 text-center",
            moreGoalsIn === 'first' ? "bg-primary/10 border-2 border-primary" : "bg-muted/50"
          )}>
            <p className="text-xs font-medium text-muted-foreground">
              1ère Mi-Temps
            </p>
            <p className={cn(
              "mt-2 text-3xl font-bold",
              moreGoalsIn === 'first' && "text-primary"
            )}>
              {firstHalfGoals}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">buts moy.</p>
          </div>
          <div className={cn(
            "rounded-xl p-4 text-center",
            moreGoalsIn === 'second' ? "bg-primary/10 border-2 border-primary" : "bg-muted/50"
          )}>
            <p className="text-xs font-medium text-muted-foreground">
              2ème Mi-Temps
            </p>
            <p className={cn(
              "mt-2 text-3xl font-bold",
              moreGoalsIn === 'second' && "text-primary"
            )}>
              {secondHalfGoals}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">buts moy.</p>
          </div>
        </div>

        {/* Prediction */}
        <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-4">
          <p className="text-sm font-medium">
            Plus de buts attendus en{' '}
            {moreGoalsIn === 'first' ? '1ère' : '2ème'} mi-temps
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Probabilité: {probability}%
          </p>
        </div>
      </div>
    </PredictionCard>
  )
}

// ============================================
// 6. CleanSheetCard - Clean Sheet
// ============================================
interface CleanSheetCardProps extends Omit<PredictionCardProps, 'type' | 'title' | 'icon' | 'children'> {
  homeCleanSheetProb: number
  awayCleanSheetProb: number
  homeDefenseRating: number
  awayDefenseRating: number
}

export function CleanSheetCard({
  homeCleanSheetProb,
  awayCleanSheetProb,
  homeDefenseRating,
  awayDefenseRating,
  ...props
}: CleanSheetCardProps) {
  return (
    <PredictionCard
      {...props}
      type="cleanSheet"
      title="Clean Sheet"
      icon={Shield}
    >
      <div className="space-y-4">
        {/* Probabilities */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-blue-500/10 p-4 text-center">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Domicile
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
              {homeCleanSheetProb}%
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Clean Sheet</p>
          </div>
          <div className="rounded-xl bg-purple-500/10 p-4 text-center">
            <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
              Extérieur
            </p>
            <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">
              {awayCleanSheetProb}%
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Clean Sheet</p>
          </div>
        </div>

        {/* Defense ratings */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Déf. domicile</p>
            <p className="mt-1 text-lg font-semibold">{homeDefenseRating}/10</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Déf. extérieur</p>
            <p className="mt-1 text-lg font-semibold">{awayDefenseRating}/10</p>
          </div>
        </div>
      </div>
    </PredictionCard>
  )
}

// ============================================
// 7. CornersCard - Corners
// ============================================
interface CornersCardProps extends Omit<PredictionCardProps, 'type' | 'title' | 'icon' | 'children'> {
  totalCornersAvg: number
  over85Probability: number
  homeAvg: number
  awayAvg: number
}

export function CornersCard({
  totalCornersAvg,
  over85Probability,
  homeAvg,
  awayAvg,
  ...props
}: CornersCardProps) {
  return (
    <PredictionCard
      {...props}
      type="corners"
      title="Corners"
      icon={Flag}
    >
      <div className="space-y-4">
        {/* Main prediction */}
        <div className="rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6 text-center">
          <p className="text-xs font-medium text-muted-foreground">
            Total corners attendus
          </p>
          <p className="mt-2 text-5xl font-bold text-yellow-600 dark:text-yellow-400">
            {totalCornersAvg}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Over 8.5: <span className="font-semibold">{over85Probability}%</span>
          </p>
        </div>

        {/* Team stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Domicile moy.</p>
            <p className="mt-1 text-lg font-semibold">{homeAvg}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Extérieur moy.</p>
            <p className="mt-1 text-lg font-semibold">{awayAvg}</p>
          </div>
        </div>
      </div>
    </PredictionCard>
  )
}

// ============================================
// 8. InternalProbabilitiesCard - Probabilités internes
// ============================================
interface InternalProbabilitiesCardProps extends Omit<PredictionCardProps, 'type' | 'title' | 'icon' | 'children'> {
  homeWin: number
  draw: number
  awayWin: number
}

export function InternalProbabilitiesCard({
  homeWin,
  draw,
  awayWin,
  ...props
}: InternalProbabilitiesCardProps) {
  return (
    <PredictionCard
      {...props}
      type="internal"
      title="Probabilités Internes"
      icon={Percent}
    >
      <div className="space-y-4">
        {/* Main probabilities */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-green-500/10 p-4 text-center">
            <p className="text-xs font-medium text-green-600 dark:text-green-400">
              Victoire D.
            </p>
            <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
              {homeWin}%
            </p>
          </div>
          <div className="rounded-xl bg-yellow-500/10 p-4 text-center">
            <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
              Match Nul
            </p>
            <p className="mt-2 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {draw}%
            </p>
          </div>
          <div className="rounded-xl bg-blue-500/10 p-4 text-center">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Victoire E.
            </p>
            <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
              {awayWin}%
            </p>
          </div>
        </div>

        {/* Visual bars */}
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Victoire Domicile</span>
              <span className="font-medium">{homeWin}%</span>
            </div>
            <Progress value={homeWin} className="h-2 bg-green-500/20" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Match Nul</span>
              <span className="font-medium">{draw}%</span>
            </div>
            <Progress value={draw} className="h-2 bg-yellow-500/20" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Victoire Extérieur</span>
              <span className="font-medium">{awayWin}%</span>
            </div>
            <Progress value={awayWin} className="h-2 bg-blue-500/20" />
          </div>
        </div>
      </div>
    </PredictionCard>
  )
}
