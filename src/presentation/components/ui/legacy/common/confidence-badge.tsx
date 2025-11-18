/**
 * ConfidenceBadge - Badge de confiance pour les prédictions BetLab
 *
 * Affiche le niveau de confiance d'une prédiction avec un code couleur
 */
import * as React from "react"
import { cn } from "@/shared/utils"
import { Badge } from "@/presentation/components/ui/badge"

export type ConfidenceLevel = 'high' | 'medium' | 'low'

interface ConfidenceBadgeProps {
  level: ConfidenceLevel
  className?: string
  showLabel?: boolean
}

const confidenceConfig = {
  high: {
    label: "Haute confiance",
    shortLabel: "Haute",
    className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
  },
  medium: {
    label: "Confiance moyenne",
    shortLabel: "Moyenne",
    className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
  },
  low: {
    label: "Faible confiance",
    shortLabel: "Faible",
    className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
  }
}

export function ConfidenceBadge({
  level,
  className,
  showLabel = true
}: ConfidenceBadgeProps) {
  const config = confidenceConfig[level]

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium px-2 py-0.5 border",
        config.className,
        className
      )}
    >
      {showLabel ? config.shortLabel : null}
    </Badge>
  )
}
