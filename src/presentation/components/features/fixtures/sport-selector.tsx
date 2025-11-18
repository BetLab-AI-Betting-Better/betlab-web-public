"use client"

/**
 * SportSelector - Currently only Football is supported
 * This component is kept for future multi-sport support
 */

import { SportType } from "@/core/config/enums/sport-type"
import { cn } from "@/shared/utils"

export function SportSelector({ className }: { className?: string }) {
  const sports = [
    { id: SportType.FOOTBALL, label: "Football", emoji: "⚽" },
  ]

  return (
    <div className={cn("flex gap-2", className)}>
      {sports.map((sport) => (
        <div
          key={sport.id}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
            "bg-lime text-navy min-h-[44px]"
          )}
          aria-label={sport.label}
        >
          <span>{sport.emoji}</span>
          <span>{sport.label}</span>
        </div>
      ))}
    </div>
  )
}
