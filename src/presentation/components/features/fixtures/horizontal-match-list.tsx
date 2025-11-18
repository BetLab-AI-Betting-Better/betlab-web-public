"use client"

/**
 * HorizontalMatchList - Liste de matchs avec défilement horizontal
 *
 * Reproduit le comportement de l'app Flutter avec:
 * - Scroll horizontal smooth
 * - Cartes de largeur fixe (340px)
 * - Espacement entre cartes (8px)
 * - Snap scroll (optional)
 * - Touch-friendly mobile
 * - Support dark mode
 *
 * @example
 * ```tsx
 * <HorizontalMatchList
 *   matches={morningMatches}
 *   onMatchClick={(id) => router.push(`/match/${id}`)}
 * />
 * ```
 */

import * as React from "react"
import { MatchCardCompact, type Match } from "./match-card-compact"
import { cn } from "@/shared/utils"

export interface HorizontalMatchListProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Liste des matchs à afficher
   */
  matches: Match[]

  /**
   * Callback au clic sur un match
   */
  onMatchClick: (matchId: string) => void

  /**
   * Callback au toggle favorite (optional)
   */
  onFavoriteToggle?: (matchId: string) => void

  /**
   * Activer le snap scroll (scroll par carte)
   * @default true
   */
  snapScroll?: boolean

  /**
   * Hauteur du conteneur
   * @default "auto"
   */
  height?: string
}

const HorizontalMatchList = React.forwardRef<HTMLDivElement, HorizontalMatchListProps>(
  (
    {
      matches,
      onMatchClick,
      onFavoriteToggle,
      snapScroll = true,
      height = "auto",
      className,
      ...props
    },
    ref
  ) => {
    const scrollContainerRef = React.useRef<HTMLDivElement>(null)

    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        style={{ height }}
        {...props}
      >
        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className={cn(
            "flex gap-2 overflow-x-auto pb-2",
            "scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent",
            snapScroll && "snap-x snap-mandatory"
          )}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "var(--muted) transparent",
          }}
        >
          {matches.map((match, index) => (
            <div
              key={match.id}
              className={cn(
                "flex-shrink-0",
                snapScroll && "snap-start"
              )}
              style={{
                width: "340px",
                // Dernière carte sans marge à droite
                marginRight: index < matches.length - 1 ? "8px" : "0",
              }}
            >
              <MatchCardCompact
                match={match}
                onClick={() => onMatchClick(match.id)}
                onFavoriteToggle={onFavoriteToggle ? () => onFavoriteToggle(match.id) : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }
)

HorizontalMatchList.displayName = "HorizontalMatchList"

export { HorizontalMatchList }
