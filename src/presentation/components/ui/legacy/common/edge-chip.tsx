/**
 * EdgeChip - Chip affichant l'edge (avantage) d'une prédiction
 *
 * Montre le pourcentage d'edge par rapport aux côtes
 */
import * as React from "react"
import { cn } from "@/shared/utils"
import { TrendingUp } from "lucide-react"

interface EdgeChipProps {
  edge: number
  className?: string
  compact?: boolean
}

export function EdgeChip({ edge, className, compact = false }: EdgeChipProps) {
  const isPositive = edge > 0
  const displayEdge = Math.abs(edge).toFixed(1)

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium",
        isPositive
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-slate-500/10 text-slate-600 dark:text-slate-400",
        className
      )}
    >
      {isPositive && <TrendingUp className="h-3 w-3" />}
      <span>
        {isPositive ? "+" : ""}{displayEdge}%
        {!compact && " edge"}
      </span>
    </div>
  )
}
