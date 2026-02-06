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
    { id: "exact", label: "Score exact" },
    { id: "htft", label: "HT/FT" },
    { id: "half", label: "Mi-temps" },
    { id: "cleansheet", label: "Clean Sheet" },
    { id: "corners", label: "Corners" },
  ]

  return (
    <div className="relative">
      <div className="flex gap-1 overflow-x-auto snap-x scrollbar-hide p-1 bg-gray-100/70 rounded-full">
        {types.map((type) => {
          const isActive = selectedType === type.id

          return (
            <button
              key={type.id}
              onClick={() => onTypeChange(type.id)}
              className={cn(
                "flex-shrink-0 snap-start px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 whitespace-nowrap",
                isActive
                  ? "bg-navy text-white shadow-sm"
                  : "text-gray-500 hover:text-navy hover:bg-white/80"
              )}
              aria-pressed={isActive}
              aria-label={`Selectionner ${type.label}`}
            >
              {type.label}
            </button>
          )
        })}
      </div>

      {/* Fade gradient right */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none rounded-r-full" />
    </div>
  )
}
