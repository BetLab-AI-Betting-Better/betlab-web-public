/**
 * PredictionCard - Carte pour afficher une prédiction détaillée
 *
 * Utilisée dans les pages de détails de match
 * Supporte plusieurs types de prédictions avec contenu personnalisable
 */
"use client"

import * as React from "react"
import { cn } from "@/shared/utils"
import { Card } from "@/presentation/components/ui/card"
import { ConfidenceBadge, type ConfidenceLevel } from "@/presentation/components/ui/legacy/common/confidence-badge"
import { EdgeChip } from "@/presentation/components/ui/legacy/common/edge-chip"
import { LucideIcon } from "lucide-react"
import { Button } from "@/presentation/components/ui/button"

export type PredictionType =
  | 'over15'
  | 'btts'
  | 'exactScore'
  | 'htft'
  | 'halfCompare'
  | 'cleanSheet'
  | 'corners'
  | 'internal'

export interface PredictionCardProps {
  type: PredictionType
  title: string
  confidence: ConfidenceLevel
  edge?: number
  value: string | number
  recommendation?: string
  stats?: Record<string, string | number>
  updatedAt?: Date
  gradient?: boolean
  children?: React.ReactNode
  onCTAClick?: () => void
  icon?: LucideIcon
  className?: string
}

export function PredictionCard({
  type,
  title,
  confidence,
  edge,
  value,
  recommendation,
  stats,
  updatedAt,
  gradient = false,
  children,
  onCTAClick,
  icon: Icon,
  className
}: PredictionCardProps) {
  const timeAgo = React.useMemo(() => {
    if (!updatedAt) return null
    const now = new Date()
    const diff = Math.floor((now.getTime() - updatedAt.getTime()) / 1000 / 60)
    if (diff < 1) return "À l'instant"
    if (diff < 60) return `Il y a ${diff} min`
    const hours = Math.floor(diff / 60)
    return `Il y a ${hours}h`
  }, [updatedAt])

  return (
    <Card
      className={cn(
        "relative w-full overflow-hidden border-2",
        gradient && "bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900",
        "p-6 md:p-8",
        className
      )}
    >
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              gradient ? "bg-white/10" : "bg-primary/10"
            )}>
              <Icon className={cn(
                "h-5 w-5",
                gradient ? "text-white" : "text-primary"
              )} />
            </div>
          )}
          <div>
            <h3 className={cn(
              "text-lg font-semibold",
              gradient && "text-white"
            )}>
              {title}
            </h3>
            <p className={cn(
              "text-sm",
              gradient ? "text-white/60" : "text-muted-foreground"
            )}>
              Type: {type}
            </p>
          </div>
        </div>
        <ConfidenceBadge level={confidence} />
      </div>

      {/* Content */}
      <div className="mb-6">
        {children ? (
          children
        ) : (
          <div className="space-y-4">
            {/* Value principale */}
            <div className="rounded-xl bg-muted/50 p-6 text-center">
              <p className={cn(
                "text-sm font-medium",
                gradient ? "text-white/80" : "text-muted-foreground"
              )}>
                Prédiction
              </p>
              <p className={cn(
                "mt-2 text-4xl font-bold",
                gradient && "text-white"
              )}>
                {value}
              </p>
            </div>

            {/* Recommendation */}
            {recommendation && (
              <div className={cn(
                "rounded-lg border-l-4 border-primary p-4",
                gradient ? "bg-white/5" : "bg-primary/5"
              )}>
                <p className={cn(
                  "text-sm font-medium",
                  gradient ? "text-white/90" : "text-foreground"
                )}>
                  {recommendation}
                </p>
              </div>
            )}

            {/* Stats */}
            {stats && Object.keys(stats).length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(stats).map(([key, value]) => (
                  <div
                    key={key}
                    className={cn(
                      "rounded-lg p-3",
                      gradient ? "bg-white/5" : "bg-muted/50"
                    )}
                  >
                    <p className={cn(
                      "text-xs",
                      gradient ? "text-white/60" : "text-muted-foreground"
                    )}>
                      {key}
                    </p>
                    <p className={cn(
                      "mt-1 text-lg font-semibold",
                      gradient && "text-white"
                    )}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2">
          {edge !== undefined && <EdgeChip edge={edge} />}
          {timeAgo && (
            <span className={cn(
              "text-xs",
              gradient ? "text-white/60" : "text-muted-foreground"
            )}>
              {timeAgo}
            </span>
          )}
        </div>
        {onCTAClick && (
          <Button
            variant={gradient ? "secondary" : "default"}
            size="sm"
            onClick={onCTAClick}
          >
            Voir détails
          </Button>
        )}
      </div>
    </Card>
  )
}
