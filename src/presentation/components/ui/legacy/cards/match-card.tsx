/**
 * MatchCard - Carte pour afficher un match avec prédiction
 *
 * Design mobile-first optimisé pour BetLab
 * Supporte plusieurs états: scheduled, live, finished
 * Variants: default, compact, skeleton
 */
"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/shared/utils"
import { Card } from "@/presentation/components/ui/card"
import { ConfidenceBadge, type ConfidenceLevel } from "@/presentation/components/ui/legacy/common/confidence-badge"
import { EdgeChip } from "@/presentation/components/ui/legacy/common/edge-chip"
import { LiveBadge } from "@/presentation/components/ui/legacy/common/live-badge"
import { Star } from "lucide-react"

export interface MatchCardProps {
  match: {
    id: number
    homeTeam: { name: string; logo: string }
    awayTeam: { name: string; logo: string }
    league: { name: string; logo: string }
    date: string
    status: 'scheduled' | 'live' | 'finished'
    score?: { home: number; away: number }
  }
  prediction?: {
    type: string
    value: string
    confidence: ConfidenceLevel
    edge?: number
  }
  isFavorite?: boolean
  onToggleFavorite?: () => void
  onClick?: () => void
  compact?: boolean
  className?: string
}

export function MatchCard({
  match,
  prediction,
  isFavorite = false,
  onToggleFavorite,
  onClick,
  compact = false,
  className
}: MatchCardProps) {
  const formattedDate = React.useMemo(() => {
    const date = new Date(match.date)
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }, [match.date])

  const logoSize = compact ? 32 : 48

  return (
    <Card
      className={cn(
        "relative w-full cursor-pointer overflow-hidden border transition-all active:scale-[0.98]",
        compact ? "min-h-[100px] p-3" : "min-h-[140px] p-4",
        "hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6">
            <Image
              src={match.league.logo}
              alt={match.league.name}
              fill
              className="object-contain"
              sizes="24px"
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {match.league.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {match.status === 'live' && <LiveBadge />}
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite()
              }}
              className="transition-colors hover:text-yellow-500"
              aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Star
                className={cn(
                  "h-4 w-4",
                  isFavorite && "fill-yellow-500 text-yellow-500"
                )}
              />
            </button>
          )}
        </div>
      </div>

      {/* Teams */}
      <div className={cn("mb-3 flex items-center justify-between", compact && "mb-2")}>
        {/* Home Team */}
        <div className={cn("flex flex-col items-center gap-1.5", compact ? "w-[30%]" : "w-[35%]")}>
          <div className={cn("relative", compact ? "h-8 w-8" : "h-12 w-12")}>
            <Image
              src={match.homeTeam.logo}
              alt={match.homeTeam.name}
              fill
              className="object-contain"
              sizes={compact ? "32px" : "48px"}
            />
          </div>
          <span className={cn(
            "text-center font-medium",
            compact ? "text-xs" : "text-sm"
          )}>
            {match.homeTeam.name}
          </span>
        </div>

        {/* Score or VS */}
        <div className="flex flex-col items-center justify-center">
          {match.status === 'finished' && match.score ? (
            <>
              <div className="flex items-center gap-2 text-2xl font-bold">
                <span>{match.score.home}</span>
                <span className="text-muted-foreground">-</span>
                <span>{match.score.away}</span>
              </div>
              <span className="text-xs text-muted-foreground">Terminé</span>
            </>
          ) : (
            <span className="text-lg font-semibold text-muted-foreground">VS</span>
          )}
        </div>

        {/* Away Team */}
        <div className={cn("flex flex-col items-center gap-1.5", compact ? "w-[30%]" : "w-[35%]")}>
          <div className={cn("relative", compact ? "h-8 w-8" : "h-12 w-12")}>
            <Image
              src={match.awayTeam.logo}
              alt={match.awayTeam.name}
              fill
              className="object-contain"
              sizes={compact ? "32px" : "48px"}
            />
          </div>
          <span className={cn(
            "text-center font-medium",
            compact ? "text-xs" : "text-sm"
          )}>
            {match.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Footer - Prediction */}
      {prediction && (
        <div className={cn(
          "flex items-center justify-between gap-2 rounded-lg bg-muted/50 p-2",
          compact && "p-1.5"
        )}>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{prediction.type}</span>
            <span className={cn("font-semibold", compact ? "text-xs" : "text-sm")}>
              {prediction.value}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {prediction.edge !== undefined && (
              <EdgeChip edge={prediction.edge} compact={compact} />
            )}
            <ConfidenceBadge level={prediction.confidence} />
          </div>
        </div>
      )}
    </Card>
  )
}

/**
 * MatchCardCompact - Version compacte de la carte match
 */
export function MatchCardCompact(props: Omit<MatchCardProps, 'compact'>) {
  return <MatchCard {...props} compact />
}
