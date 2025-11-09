"use client"

import { cn } from "@/shared/utils"
import { Flame, Heart, TrendingUp, AlertTriangle, Zap } from "lucide-react"

interface MatchBadgesProps {
  formIndex?: number
  injuryFactor?: number
  edge?: number
  restDays?: number
  className?: string
}

/**
 * Badges pour afficher les indicateurs clés d'un match
 */
export function MatchBadges({
  formIndex,
  injuryFactor,
  edge,
  restDays,
  className
}: MatchBadgesProps) {
  const badges = []

  // 🔥 Hot Form - si form_index > 0.5
  if (formIndex !== undefined && formIndex > 0.5) {
    badges.push(
      <div
        key="form"
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-[10px] font-semibold"
        title={`Forme excellente: ${(formIndex * 100).toFixed(0)}%`}
      >
        <Flame className="w-3 h-3" />
        <span>Hot</span>
      </div>
    )
  } else if (formIndex !== undefined && formIndex < -0.3) {
    badges.push(
      <div
        key="form"
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-semibold"
        title={`Forme en baisse: ${(formIndex * 100).toFixed(0)}%`}
      >
        <TrendingUp className="w-3 h-3 rotate-180" />
        <span>Cold</span>
      </div>
    )
  }

  // ⚡ Fresh Team - si repos > 7 jours
  if (restDays !== undefined && restDays > 7) {
    badges.push(
      <div
        key="rest"
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] font-semibold"
        title={`${restDays.toFixed(1)} jours de repos`}
      >
        <Zap className="w-3 h-3" />
        <span>Fresh</span>
      </div>
    )
  }

  // ⚠️ Injury Issues - si injury_factor < 0.7
  if (injuryFactor !== undefined && injuryFactor < 0.7) {
    badges.push(
      <div
        key="injury"
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-[10px] font-semibold"
        title={`Joueurs disponibles: ${(injuryFactor * 100).toFixed(0)}%`}
      >
        <AlertTriangle className="w-3 h-3" />
        <span>Injuries</span>
      </div>
    )
  }

  // 💎 Value Bet - si edge > 5%
  if (edge !== undefined && edge > 0.05) {
    badges.push(
      <div
        key="value"
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px] font-semibold"
        title={`Value: +${(edge * 100).toFixed(1)}%`}
      >
        <Heart className="w-3 h-3" />
        <span>Value</span>
      </div>
    )
  }

  if (badges.length === 0) return null

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {badges}
    </div>
  )
}

/**
 * Badge individuel pour afficher un edge/value
 */
interface EdgeBadgeProps {
  edge: number
  className?: string
}

export function EdgeBadge({ edge, className }: EdgeBadgeProps) {
  const isPositive = edge > 0
  const isSignificant = Math.abs(edge) > 0.05

  if (!isSignificant) return null

  return (
    <div
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold",
        isPositive
          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
        className
      )}
      title={isPositive ? "Bonne value" : "Mauvaise value"}
    >
      {isPositive ? "+" : ""}{(edge * 100).toFixed(1)}%
    </div>
  )
}
