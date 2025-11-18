"use client"

import { useState } from "react"
import { ChevronDown, Filter } from "lucide-react"
import { Slider } from "@/presentation/components/ui/slider"
import { cn } from "@/shared/utils"

export type ConfidenceLevel = "high" | "medium" | "low"

interface FiltersPanelProps {
  selectedConfidences: ConfidenceLevel[]
  onConfidencesChange: (confidences: ConfidenceLevel[]) => void
  xGRange: [number, number]
  onXGRangeChange: (range: [number, number]) => void
  minProbability: number
  onMinProbabilityChange: (value: number) => void
}

export function FiltersPanel({
  selectedConfidences,
  onConfidencesChange,
  xGRange,
  onXGRangeChange,
  minProbability,
  onMinProbabilityChange,
}: FiltersPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const confidences: { id: ConfidenceLevel; label: string; color: string }[] = [
    { id: "high", label: "High", color: "bg-green-500" },
    { id: "medium", label: "Medium", color: "bg-orange-500" },
    { id: "low", label: "Low", color: "bg-red-500" },
  ]

  const toggleConfidence = (confidence: ConfidenceLevel) => {
    if (selectedConfidences.includes(confidence)) {
      onConfidencesChange(selectedConfidences.filter(c => c !== confidence))
    } else {
      onConfidencesChange([...selectedConfidences, confidence])
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header collapsible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted hover:bg-muted/80 transition-colors min-h-[44px]"
        aria-expanded={isOpen}
        aria-controls="filters-content"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filtres</span>
          {selectedConfidences.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-lime text-navy text-xs font-medium">
              {selectedConfidences.length}
            </span>
          )}
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Content */}
      {isOpen && (
        <div id="filters-content" className="p-4 space-y-6">
          {/* Confidence */}
          <div className="space-y-2">
            <label className="text-sm font-medium block">Confiance</label>
            <div className="flex gap-2">
              {confidences.map((conf) => (
                <button
                  key={conf.id}
                  onClick={() => toggleConfidence(conf.id)}
                  className={cn(
                    "flex-1 h-10 rounded-lg text-sm font-medium transition-all min-h-[44px] flex items-center justify-center gap-2",
                    selectedConfidences.includes(conf.id)
                      ? "bg-lime text-navy scale-105"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                  aria-pressed={selectedConfidences.includes(conf.id)}
                  aria-label={`${conf.label} confidence`}
                >
                  <span className={cn("inline-block w-2 h-2 rounded-full", conf.color)} />
                  {conf.label}
                </button>
              ))}
            </div>
          </div>

          {/* xG Range */}
          <div className="space-y-2">
            <label htmlFor="xg-slider" className="text-sm font-medium block">
              xG Range: {xGRange[0].toFixed(1)} - {xGRange[1].toFixed(1)}
            </label>
            <Slider
              id="xg-slider"
              min={0}
              max={5}
              step={0.1}
              value={xGRange}
              onValueChange={(value) => onXGRangeChange(value as [number, number])}
              className="w-full"
              aria-label="Expected Goals range"
            />
          </div>

          {/* Min Probability */}
          <div className="space-y-2">
            <label htmlFor="probability-slider" className="text-sm font-medium block">
              Probabilité min: {minProbability}%
            </label>
            <Slider
              id="probability-slider"
              min={0}
              max={100}
              step={5}
              value={[minProbability]}
              onValueChange={(value) => onMinProbabilityChange(value[0])}
              className="w-full"
              aria-label="Minimum probability percentage"
            />
          </div>
        </div>
      )}
    </div>
  )
}
