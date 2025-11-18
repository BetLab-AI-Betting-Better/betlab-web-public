"use client"

import { cn } from "@/shared/utils"

export type PredictionType =
  | "all"
  | "internal"
  | "external"
  | "over15"
  | "btts"
  | "exact"
  | "htft"
  | "half"
  | "cleansheet"
  | "corners"

interface PredictionsSelectorProps {
  selectedType: PredictionType
  onTypeChange: (type: PredictionType) => void
}

export function PredictionsSelector({ selectedType, onTypeChange }: PredictionsSelectorProps) {
  const types: { id: PredictionType; label: string }[] = [
    { id: "all", label: "Toutes" },
    { id: "internal", label: "Internal" },
    { id: "external", label: "External" },
    { id: "over15", label: "Over 1.5" },
    { id: "btts", label: "BTTS" },
    { id: "exact", label: "Exact Score" },
    { id: "htft", label: "HT/FT" },
    { id: "half", label: "Half Compare" },
    { id: "cleansheet", label: "Clean Sheet" },
    { id: "corners", label: "Corners" },
  ]

  return (
    <div className="relative">
      {/* Tabs scrollables */}
      <div className="flex gap-1 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
        {types.map((type) => {
          const isActive = selectedType === type.id

          return (
            <button
              key={type.id}
              onClick={() => onTypeChange(type.id)}
              className={cn(
                "flex-shrink-0 snap-start px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap min-h-[44px]",
                isActive
                  ? "bg-navy text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
              aria-pressed={isActive}
              aria-label={`Sélectionner ${type.label}`}
            >
              {type.label}
            </button>
          )
        })}
      </div>

      {/* Fade gradient pour indiquer le scroll */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  )
}
