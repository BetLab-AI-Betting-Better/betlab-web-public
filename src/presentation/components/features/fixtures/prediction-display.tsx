"use client"

/**
 * PredictionDisplay - Affichage des prédictions selon type
 *
 * Composant adaptatif qui affiche les prédictions de différentes manières
 * selon leur type (internal, over15, btts, exact, etc.).
 * - 8 types de prédictions supportés
 * - Mode compact pour les cards
 * - Mode full pour les pages de détail
 * - Visualisations interactives
 * - Mobile-optimized
 * - Support dark mode
 *
 * @example
 * ```tsx
 * // Mode compact dans une card
 * <PredictionDisplay prediction={match.prediction} compact />
 *
 * // Mode full sur une page de détail
 * <PredictionDisplay prediction={match.prediction} />
 * ```
 */

import * as React from "react"
import { ConfidenceBadge } from "@/presentation/components/ui/confidence-badge"
import { EdgeChip } from "@/presentation/components/ui/edge-chip"
import { cn } from "@/shared/utils"

export type PredictionType =
  | "internal"
  | "over15"
  | "btts"
  | "exact"
  | "htft"
  | "half"
  | "cleansheet"
  | "corners"

export interface Prediction {
  type: PredictionType
  confidence: "high" | "medium" | "low"
  value: string // e.g., "Over 1.5", "BTTS Yes", "2-1"
  probability?: number // 0-100
  edge?: number // % edge
  details?: {
    topScores?: string[]
    homeProb?: number
    awayProb?: number
    drawProb?: number
    [key: string]: unknown
  }
}

export interface PredictionDisplayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  prediction: Prediction
  compact?: boolean
}

const PredictionDisplay = React.forwardRef<HTMLDivElement, PredictionDisplayProps>(
  ({ prediction, compact = false, className, ...props }, ref) => {
    if (compact) {
      return (
        <CompactDisplay
          ref={ref}
          prediction={prediction}
          className={className}
          {...props}
        />
      )
    }

    // Full mode - render selon le type
    switch (prediction.type) {
      case "over15":
        return <Over15Display prediction={prediction} className={className} {...props} />
      case "btts":
        return <BTTSDisplay prediction={prediction} className={className} {...props} />
      case "exact":
        return <ExactScoreDisplay prediction={prediction} className={className} {...props} />
      case "htft":
        return <HTFTDisplay prediction={prediction} className={className} {...props} />
      case "half":
        return <HalfDisplay prediction={prediction} className={className} {...props} />
      case "cleansheet":
        return <CleanSheetDisplay prediction={prediction} className={className} {...props} />
      case "corners":
        return <CornersDisplay prediction={prediction} className={className} {...props} />
      default:
        return <GenericDisplay prediction={prediction} className={className} {...props} />
    }
  }
)

PredictionDisplay.displayName = "PredictionDisplay"

/**
 * Compact Display - Vue condensée pour les cards
 */
const CompactDisplay = React.forwardRef<HTMLDivElement, PredictionDisplayProps>(
  ({ prediction, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between p-2 rounded bg-muted/50",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <ConfidenceBadge level={prediction.confidence} size="sm" />
          <span className="text-sm font-medium truncate">{prediction.value}</span>
        </div>
        {prediction.probability && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {prediction.probability}%
          </span>
        )}
      </div>
    )
  }
)

CompactDisplay.displayName = "CompactDisplay"

/**
 * Over 1.5 Display
 */
function Over15Display({
  prediction,
  className,
  ...props
}: Omit<PredictionDisplayProps, "compact">) {
  const isOver = prediction.value.startsWith("Over")

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">{prediction.value}</span>
        <div className="flex items-center gap-2">
          <ConfidenceBadge level={prediction.confidence} />
          {prediction.edge && <EdgeChip edge={prediction.edge} />}
        </div>
      </div>

      {prediction.probability && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Probabilité</span>
            <span className="font-medium tabular-nums">{prediction.probability}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--lime)] transition-all duration-500"
              style={{ width: `${prediction.probability}%` }}
            />
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {isOver ? "✓ Recommandé" : "✗ Déconseillé"}
      </p>
    </div>
  )
}

/**
 * BTTS Display
 */
function BTTSDisplay({
  prediction,
  className,
  ...props
}: Omit<PredictionDisplayProps, "compact">) {
  const isBTTS = prediction.value === "BTTS Yes"

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">Both Teams To Score</span>
        <div className="flex items-center gap-2">
          <ConfidenceBadge level={prediction.confidence} size="sm" />
          {prediction.edge && <EdgeChip edge={prediction.edge} size="sm" />}
        </div>
      </div>

      <div className="flex gap-2">
        <div
          className={cn(
            "flex-1 p-3 rounded-lg text-center text-sm font-medium transition-all",
            isBTTS
              ? "bg-[var(--lime)] text-[var(--navy)] shadow-md"
              : "bg-muted text-muted-foreground"
          )}
        >
          Yes
        </div>
        <div
          className={cn(
            "flex-1 p-3 rounded-lg text-center text-sm font-medium transition-all",
            !isBTTS
              ? "bg-[var(--lime)] text-[var(--navy)] shadow-md"
              : "bg-muted text-muted-foreground"
          )}
        >
          No
        </div>
      </div>

      {prediction.probability && (
        <div className="text-center text-xs text-muted-foreground">
          Probabilité: <span className="font-medium tabular-nums">{prediction.probability}%</span>
        </div>
      )}
    </div>
  )
}

/**
 * Exact Score Display
 */
function ExactScoreDisplay({
  prediction,
  className,
  ...props
}: Omit<PredictionDisplayProps, "compact">) {
  const topScores = prediction.details?.topScores || ["2-1", "1-1", "2-0"]

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Top 3 scores</span>
          <ConfidenceBadge level={prediction.confidence} size="sm" />
        </div>
        {prediction.edge && <EdgeChip edge={prediction.edge} size="sm" />}
      </div>

      <div className="flex gap-2">
        {topScores.slice(0, 3).map((score: string, i: number) => (
          <div
            key={i}
            className={cn(
              "flex-1 p-3 rounded-lg text-center text-sm font-bold transition-all",
              i === 0
                ? "bg-[var(--lime)] text-[var(--navy)] shadow-md"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            {score}
          </div>
        ))}
      </div>

      {prediction.probability && (
        <div className="text-center text-xs text-muted-foreground">
          Probabilité: <span className="font-medium tabular-nums">{prediction.probability}%</span>
        </div>
      )}
    </div>
  )
}

/**
 * HT/FT Display
 */
function HTFTDisplay({
  prediction,
  className,
  ...props
}: Omit<PredictionDisplayProps, "compact">) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Half Time / Full Time</span>
        <div className="flex items-center gap-2">
          <ConfidenceBadge level={prediction.confidence} size="sm" />
          {prediction.edge && <EdgeChip edge={prediction.edge} size="sm" />}
        </div>
      </div>

      <div className="p-3 rounded-lg bg-[var(--lime)] text-[var(--navy)] text-center">
        <div className="text-lg font-bold">{prediction.value}</div>
        {prediction.probability && (
          <div className="text-xs opacity-80 tabular-nums">{prediction.probability}%</div>
        )}
      </div>
    </div>
  )
}

/**
 * Half Display (1st/2nd Half predictions)
 */
function HalfDisplay({
  prediction,
  className,
  ...props
}: Omit<PredictionDisplayProps, "compact">) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{prediction.value}</span>
          <ConfidenceBadge level={prediction.confidence} size="sm" />
        </div>
        {prediction.edge && <EdgeChip edge={prediction.edge} size="sm" />}
      </div>

      {prediction.probability && (
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--lime)] transition-all duration-500"
            style={{ width: `${prediction.probability}%` }}
          />
        </div>
      )}
    </div>
  )
}

/**
 * Clean Sheet Display
 */
function CleanSheetDisplay({
  prediction,
  className,
  ...props
}: Omit<PredictionDisplayProps, "compact">) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{prediction.value}</span>
          <ConfidenceBadge level={prediction.confidence} size="sm" />
        </div>
        {prediction.edge && <EdgeChip edge={prediction.edge} size="sm" />}
      </div>

      {prediction.probability && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Probabilité Clean Sheet</span>
            <span className="font-medium tabular-nums">{prediction.probability}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--success)] transition-all duration-500"
              style={{ width: `${prediction.probability}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Corners Display
 */
function CornersDisplay({
  prediction,
  className,
  ...props
}: Omit<PredictionDisplayProps, "compact">) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">{prediction.value}</span>
          <ConfidenceBadge level={prediction.confidence} size="sm" />
        </div>
        {prediction.edge && <EdgeChip edge={prediction.edge} size="sm" />}
      </div>

      {prediction.probability && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Probabilité</span>
            <span className="font-medium tabular-nums">{prediction.probability}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--warning)] transition-all duration-500"
              style={{ width: `${prediction.probability}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Generic Display (fallback)
 */
function GenericDisplay({
  prediction,
  className,
  ...props
}: Omit<PredictionDisplayProps, "compact">) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg bg-muted/50",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <ConfidenceBadge level={prediction.confidence} />
        <span className="text-sm font-medium">{prediction.value}</span>
      </div>
      {prediction.probability && (
        <span className="text-sm text-muted-foreground tabular-nums">
          {prediction.probability}%
        </span>
      )}
    </div>
  )
}

export { PredictionDisplay }
