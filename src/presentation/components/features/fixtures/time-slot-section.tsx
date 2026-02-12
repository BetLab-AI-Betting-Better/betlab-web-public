"use client"

/**
 * TimeSlotSection - Section créneau horaire avec scroll horizontal
 *
 * Groupe les matchs par créneau horaire avec:
 * - Header avec titre du créneau et compteur
 * - Liste horizontale de cartes de matchs
 * - Support dark mode
 *
 * @example
 * ```tsx
 * <TimeSlotSection
 *   title="Matin"
 *   matches={morningMatches}
 *   onMatchClick={(id) => router.push(`/matches/${id}`)}
 *   onFavoriteToggle={(id) => toggleFavorite(id)}
 * />
 * ```
 */

import * as React from "react"
import { HorizontalMatchList } from "./horizontal-match-list"
import type { MatchCardVM } from "@/application/view-models/fixtures/match-card.vm"
import { cn } from "@/shared/utils"

export interface TimeSlotSectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Titre du créneau (Matin, Après-midi, Soirée, Nuit)
   */
  title: string

  /**
   * Liste des matchs du créneau
   */
  matches: MatchCardVM[]

  /**
   * Callback au clic sur un match
   */
  onMatchClick: (matchId: string) => void

  /**
   * Callback au toggle favorite (optional)
   */
  onFavoriteToggle?: (matchId: string) => void
}

const TimeSlotSection = React.forwardRef<HTMLDivElement, TimeSlotSectionProps>(
  (
    {
      title,
      matches,
      onMatchClick,
      onFavoriteToggle,
      className,
      ...props
    },
    ref
  ) => {
    // Get emoji pour chaque créneau
    const getTimeSlotEmoji = (title: string) => {
      switch (title.toLowerCase()) {
        case "matin":
          return "🌅"
        case "après-midi":
          return "☀️"
        case "soirée":
          return "🌆"
        case "nuit":
          return "🌙"
        default:
          return "⚽"
      }
    }

    return (
      <div
        ref={ref}
        className={cn("space-y-3", className)}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4">
          <span className="text-base">{getTimeSlotEmoji(title)}</span>
          <span className="text-sm font-bold">{title}</span>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-semibold",
              "bg-[var(--lime)] text-[var(--navy)]"
            )}
            aria-label={`${matches.length} match${matches.length > 1 ? "s" : ""}`}
          >
            {matches.length}
          </span>
        </div>

        {/* Matches - Horizontal Scroll */}
        <HorizontalMatchList
          matches={matches}
          onMatchClick={onMatchClick}
          onFavoriteToggle={onFavoriteToggle}
        />
      </div>
    )
  }
)

TimeSlotSection.displayName = "TimeSlotSection"

export { TimeSlotSection }
