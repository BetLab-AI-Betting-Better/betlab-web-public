"use client"

/**
 * MatchCardCompact - Card de match mobile avec swipe action
 *
 * Card interactive optimisée mobile pour afficher un match avec:
 * - Swipe left pour add/remove favorite
 * - Tap pour naviguer vers le détail du match
 * - Affichage de la prédiction selon type sélectionné
 * - Live badge si match en cours
 * - Ripple effect au tap
 * - Height: min 120px
 * - Touch targets >= 44px
 * - Support dark mode
 *
 * @example
 * ```tsx
 * <MatchCardCompact
 *   match={match}
 *   onClick={() => router.push(`/matches/${match.id}`)}
 *   onFavoriteToggle={() => toggleFavorite(match.id)}
 * />
 * ```
 */

import * as React from "react"
import Image from "next/image"
import { useSwipeable } from "react-swipeable"
import { Star } from "lucide-react"
import { format, fr } from "@/shared/utils/date"
import { TEAM_LOGO_BLUR } from "@/shared/utils/image-loader"
import type { PredictionData } from "@/modules/predictions/domain/types"
import { cn } from "@/shared/utils"

export interface Match {
  id: string
  homeTeam: {
    name: string
    logo: string
  }
  awayTeam: {
    name: string
    logo: string
  }
  league: {
    name: string
    logo: string
  }
  kickoffTime: Date
  status: "scheduled" | "live" | "finished"
  score?: {
    home: number
    away: number
  }
  prediction?: PredictionData
  isFavorite?: boolean
}

export interface MatchCardCompactProps
  extends React.HTMLAttributes<HTMLDivElement> {
  match: Match
  onFavoriteToggle?: () => void
}

const MatchCardCompact = React.forwardRef<HTMLDivElement, MatchCardCompactProps>(
  ({ match, onClick, onFavoriteToggle, className, ...props }, ref) => {
    const [isRippling, setIsRippling] = React.useState(false)
    const [ripplePosition, setRipplePosition] = React.useState({ x: 0, y: 0 })
    const internalRef = React.useRef<HTMLDivElement>(null)

    // Swipe handlers pour favorite toggle
    const { ref: swipeRef, ...swipeHandlers } = useSwipeable({
      onSwipedLeft: (eventData) => {
        // Seulement si le swipe est assez long
        if (Math.abs(eventData.deltaX) > 50 && onFavoriteToggle) {
          onFavoriteToggle()
        }
      },
      trackTouch: true,
      delta: 50, // Minimum delta pour trigger
      preventScrollOnSwipe: false,
      trackMouse: false, // Pas de swipe à la souris
    })

    // Merge refs
    React.useEffect(() => {
      if (typeof swipeRef === 'function') {
        swipeRef(internalRef.current)
      }
    }, [swipeRef])

    // Expose ref
    React.useImperativeHandle(ref, () => internalRef.current!)

    // Ripple effect au tap
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      setRipplePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsRippling(true)
      setTimeout(() => setIsRippling(false), 600)

      onClick?.(e)
    }

    return (
      <div
        ref={internalRef}
        {...swipeHandlers}
        onClick={handleClick}
        className={cn(
          "relative h-[200px] p-4 rounded-lg border-2 transition-all cursor-pointer overflow-hidden",
          "hover:border-[var(--lime)] active:scale-[0.98]",
          "touch-manipulation select-none flex flex-col",
          match.isFavorite
            ? "border-[var(--lime)] bg-[var(--lime)]/5"
            : "border-border bg-card",
          className
        )}
        role="button"
        tabIndex={0}
        aria-label={`Match ${match.homeTeam.name} vs ${match.awayTeam.name}`}
        {...props}
      >
        {/* Ripple effect */}
        {isRippling && (
          <span
            className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
            style={{
              left: ripplePosition.x,
              top: ripplePosition.y,
              width: 0,
              height: 0,
            }}
          />
        )}

        {/* Header: League */}
        <div className="flex items-center gap-2 min-w-0 mb-3">
          <Image
            src={match.league.logo}
            alt=""
            width={16}
            height={16}
            className="shrink-0"
            loading="lazy"
            quality={75}
          />
          <span className="text-xs text-muted-foreground truncate">
            {match.league.name}
          </span>
        </div>

        {/* Teams */}
        <div className="flex items-start justify-between gap-4 mb-3">
          {/* Home Team */}
          <div className="flex flex-col items-center flex-1 min-w-0">
            <Image
              src={match.homeTeam.logo}
              alt={match.homeTeam.name}
              width={40}
              height={40}
              className="shrink-0 rounded-full shadow-sm"
              loading="lazy"
              quality={75}
              placeholder="blur"
              blurDataURL={TEAM_LOGO_BLUR}
            />
            <span className="text-sm font-bold text-center truncate mt-1.5 w-full px-1">
              {match.homeTeam.name}
            </span>
            {match.prediction?.type === "match_result" && (
              <span className="text-[10px] text-muted-foreground mt-0.5">
                xG: {match.prediction.xG.home.toFixed(2)}
              </span>
            )}
          </div>

          {/* Score/Time Center */}
          <div className="flex flex-col items-center justify-center shrink-0 px-2 min-w-[60px]">
            {match.status === "scheduled" ? (
              <>
                <span className="text-lg font-bold text-[var(--navy)] tabular-nums mb-1">
                  {format(match.kickoffTime, "HH:mm", { locale: fr })}
                </span>
                <div className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-white bg-[var(--navy)]">
                  À venir
                </div>
              </>
            ) : (
              <>
                <span className="text-2xl font-bold text-[var(--navy)] tabular-nums mb-1">
                  {match.score ? `${match.score.home} - ${match.score.away}` : "- - -"}
                </span>
                <div className={cn(
                  "px-2.5 py-1 rounded-md text-[11px] font-semibold text-white",
                  match.status === "live" ? "bg-[var(--live)]" : "bg-[var(--navy)]/60"
                )}>
                  {match.status === "live" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse" />}
                  {match.status === "live" && "En cours"}
                  {match.status === "finished" && "Terminé"}
                </div>
              </>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center flex-1 min-w-0">
            <Image
              src={match.awayTeam.logo}
              alt={match.awayTeam.name}
              width={40}
              height={40}
              className="shrink-0 rounded-full shadow-sm"
              loading="lazy"
              quality={75}
              placeholder="blur"
              blurDataURL={TEAM_LOGO_BLUR}
            />
            <span className="text-sm font-bold text-center truncate mt-1.5 w-full px-1">
              {match.awayTeam.name}
            </span>
            {match.prediction?.type === "match_result" && (
              <span className="text-[10px] text-muted-foreground mt-0.5">
                xG: {match.prediction.xG.away.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Prediction - V1/X/V2 Display */}
        <div className="flex justify-center mt-2">
          {match.prediction?.type === "match_result" ? (() => {
            const prediction = match.prediction as Extract<PredictionData, { type: "match_result" }>
            const homeProb = prediction.homeWin.probability * 100
            const drawProb = prediction.draw.probability * 100
            const awayProb = prediction.awayWin.probability * 100
            const maxProb = Math.max(homeProb, drawProb, awayProb)

            return (
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-lg bg-[var(--navy-ultra-light)] border border-[var(--lime)] border-opacity-30">
                <span className="text-[11px] whitespace-nowrap">
                  <span className={cn("font-bold", homeProb === maxProb ? "text-[var(--lime)]" : "text-[var(--gray)]")}>
                    V1
                  </span>
                  {" "}
                  <span className={cn("font-semibold", homeProb === maxProb ? "text-[var(--navy)]" : "text-[var(--text-primary)]")}>
                    {homeProb.toFixed(1)}%
                  </span>
                </span>

                <span className="text-[11px] whitespace-nowrap">
                  <span className={cn("font-bold", drawProb === maxProb ? "text-[var(--lime)]" : "text-[var(--gray)]")}>
                    X
                  </span>
                  {" "}
                  <span className={cn("font-semibold", drawProb === maxProb ? "text-[var(--navy)]" : "text-[var(--text-primary)]")}>
                    {drawProb.toFixed(1)}%
                  </span>
                </span>

                <span className="text-[11px] whitespace-nowrap">
                  <span className={cn("font-bold", awayProb === maxProb ? "text-[var(--lime)]" : "text-[var(--gray)]")}>
                    V2
                  </span>
                  {" "}
                  <span className={cn("font-semibold", awayProb === maxProb ? "text-[var(--navy)]" : "text-[var(--text-primary)]")}>
                    {awayProb.toFixed(1)}%
                  </span>
                </span>
              </div>
            )
          })() : (
            <div className="inline-flex items-center px-4 py-1.5 rounded-lg bg-muted text-muted-foreground">
              <span className="text-[11px]">Chargement...</span>
            </div>
          )}
        </div>

        {/* Favorite button */}
        {onFavoriteToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onFavoriteToggle()
            }}
            className={cn(
              "absolute top-2 right-2 p-2 rounded-full transition-all",
              "hover:bg-muted/50 active:scale-90",
              "min-w-[44px] min-h-[44px] flex items-center justify-center",
              "touch-manipulation"
            )}
          aria-label={
            match.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
          }
          type="button"
        >
          <Star
            className={cn(
              "w-5 h-5 transition-all",
              match.isFavorite
                ? "fill-[var(--lime)] text-[var(--lime)]"
                : "text-muted-foreground"
            )}
          />
        </button>
        )}
      </div>
    )
  }
)

MatchCardCompact.displayName = "MatchCardCompact"

export { MatchCardCompact }
