"use client"

import { Check, X } from "lucide-react"
import { cn } from "@/shared/utils"
import type { PredictionOutcome } from "./utils/prediction-validation"

interface PredictionValidationBadgeProps {
  outcome: PredictionOutcome
  /** "inline" for next to Prono chip, "overlay" for on probability bar segment */
  variant?: "inline" | "overlay"
  className?: string
}

export function PredictionValidationBadge({
  outcome,
  variant = "inline",
  className,
}: PredictionValidationBadgeProps) {
  if (outcome === null) return null

  const isCorrect = outcome === "correct"

  if (variant === "overlay") {
    return (
      <span
        className={cn(
          "absolute -top-1.5 -right-1.5 z-10",
          "w-4 h-4 rounded-full flex items-center justify-center",
          "shadow-xs ring-2 ring-white",
          "shadow-xs ring-2 ring-white",
          isCorrect ? "bg-success" :
            outcome === "void" ? "bg-gray-400" :
              outcome === "half-win" ? "bg-lime-500" :
                outcome === "half-loss" ? "bg-orange-500" :
                  "bg-error",
          className
        )}
        aria-label={`Résultat: ${outcome}`}
      >
        {isCorrect && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
        {outcome === "incorrect" && <X className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
        {outcome === "void" && <span className="text-[8px] font-bold text-white leading-none">R</span>}
        {outcome === "half-win" && <span className="text-[8px] font-bold text-white leading-none">½V</span>}
        {outcome === "half-loss" && <span className="text-[8px] font-bold text-white leading-none">½D</span>}
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold",
        isCorrect ? "bg-success/10 text-success" :
          outcome === "void" ? "bg-gray-100 text-gray-500" :
            outcome === "half-win" ? "bg-lime-100 text-lime-700" :
              outcome === "half-loss" ? "bg-orange-100 text-orange-700" :
                "bg-error/10 text-error",
        className
      )}
      aria-label={`Résultat: ${outcome}`}
    >
      {isCorrect && (
        <>
          <Check className="w-3 h-3" strokeWidth={3} />
          <span>Bon</span>
        </>
      )}
      {outcome === "incorrect" && (
        <>
          <X className="w-3 h-3" strokeWidth={3} />
          <span>Rate</span>
        </>
      )}
      {outcome === "void" && <span>Remboursé</span>}
      {outcome === "half-win" && <span>½ Gagné</span>}
      {outcome === "half-loss" && <span>½ Perdu</span>}
    </span>
  )
}
