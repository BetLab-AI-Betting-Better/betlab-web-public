"use client"

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
  const confidences: { id: ConfidenceLevel; label: string; dot: string }[] = [
    { id: "high", label: "Haute", dot: "bg-emerald-500" },
    { id: "medium", label: "Moyenne", dot: "bg-amber-500" },
    { id: "low", label: "Basse", dot: "bg-red-500" },
  ]

  const toggleConfidence = (confidence: ConfidenceLevel) => {
    if (selectedConfidences.includes(confidence)) {
      onConfidencesChange(selectedConfidences.filter(c => c !== confidence))
    } else {
      onConfidencesChange([...selectedConfidences, confidence])
    }
  }

  return (
    <div className="space-y-4 pt-2">
      {/* Confidence */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
          Confiance
        </label>
        <div className="flex gap-2">
          {confidences.map((conf) => {
            const isActive = selectedConfidences.includes(conf.id)
            return (
              <button
                key={conf.id}
                onClick={() => toggleConfidence(conf.id)}
                className={cn(
                  "flex-1 py-2 rounded-lg text-[12px] font-medium transition-all duration-200",
                  "flex items-center justify-center gap-1.5",
                  "border",
                  isActive
                    ? "bg-navy text-white border-navy shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-navy/30 hover:text-navy"
                )}
                aria-pressed={isActive}
              >
                <span className={cn(
                  "inline-block w-1.5 h-1.5 rounded-full",
                  isActive ? "bg-white/60" : conf.dot
                )} />
                {conf.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* xG Range */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="xg-slider" className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            xG Range
          </label>
          <span className="text-[12px] font-bold text-navy tabular-nums">
            {xGRange[0].toFixed(1)} - {xGRange[1].toFixed(1)}
          </span>
        </div>
        <Slider
          id="xg-slider"
          min={0}
          max={5}
          step={0.1}
          value={xGRange}
          onValueChange={(value) => onXGRangeChange(value as [number, number])}
          className="w-full"
        />
      </div>

      {/* Min Probability */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="probability-slider" className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Probabilite min
          </label>
          <span className="text-[12px] font-bold text-navy tabular-nums">
            {minProbability}%
          </span>
        </div>
        <Slider
          id="probability-slider"
          min={0}
          max={100}
          step={5}
          value={[minProbability]}
          onValueChange={(value) => onMinProbabilityChange(value[0])}
          className="w-full"
        />
      </div>
    </div>
  )
}
