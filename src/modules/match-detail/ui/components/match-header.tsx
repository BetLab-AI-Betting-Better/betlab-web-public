"use client"

import { Heart } from "lucide-react"
import Image from "next/image"
import { cn } from "@/shared/utils"
import type { MatchDetail } from "@/modules/match-detail/domain/types"

interface MatchHeaderProps {
  match: MatchDetail
}

/**
 * Header sticky du match avec informations principales
 * Mobile-first avec touch targets ≥44px
 */
export function MatchHeader({ match }: MatchHeaderProps) {
  const isLive = match.status === "live"
  const isFinished = match.status === "finished"
  const isScheduled = match.status === "scheduled"

  return (
    <div className="sticky top-0 z-50 bg-background border-b shadow-sm">
      {/* Safe area pour iOS notch */}
      <div className="h-[env(safe-area-inset-top)]" />

      <div className="container mx-auto px-4 py-4 h-[180px] flex flex-col justify-between">
        {/* League Info + Favorite Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6">
              <Image
                src={match.league.logo}
                alt={match.league.name}
                fill
                className="object-contain"
                sizes="24px"
              />
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              {match.league.name}
            </span>
          </div>

          {/* Favorite Button - Touch target ≥44px */}
          <button
            className={cn(
              "relative flex items-center justify-center",
              "w-11 h-11 rounded-full",
              "transition-colors duration-200",
              "active:scale-95",
              "bg-gray-100 dark:bg-gray-800"
            )}
            aria-label="Ajouter aux favoris"
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-colors",
                "text-gray-500 dark:text-gray-400"
              )}
            />
          </button>
        </div>

        {/* Teams + Score/Time */}
        <div className="flex items-center justify-between gap-4">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="relative w-16 h-16">
              <Image
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                fill
                className="object-contain"
                sizes="64px"
                priority
              />
            </div>
            <span className="text-sm font-medium text-center line-clamp-1">
              {match.homeTeam.name}
            </span>
          </div>

          {/* Center Info (Live Badge / Score / Kickoff) */}
          <div className="flex flex-col items-center justify-center gap-1 min-w-[80px]">
            {isLive && <LiveBadge />}

            {isFinished && match.score && (
              <ScoreDisplay
                homeScore={match.score.home}
                awayScore={match.score.away}
              />
            )}

            {isScheduled && <KickoffTime time={match.kickoffTime} />}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="relative w-16 h-16">
              <Image
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                fill
                className="object-contain"
                sizes="64px"
                priority
              />
            </div>
            <span className="text-sm font-medium text-center line-clamp-1">
              {match.awayTeam.name}
            </span>
          </div>
        </div>

        {/* Additional Info (Venue, Referee) */}
        {(match.venue || match.referee) && (
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            {match.venue && <span>{match.venue}</span>}
            {match.venue && match.referee && <span>•</span>}
            {match.referee && <span>{match.referee}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Badge "Live" animé pour les matchs en cours
 */
function LiveBadge() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 rounded-full animate-pulse">
      <div className="w-2 h-2 bg-white rounded-full" />
      <span className="text-xs font-bold text-white uppercase">Live</span>
    </div>
  )
}

/**
 * Affichage du score pour les matchs terminés
 */
interface ScoreDisplayProps {
  homeScore: number
  awayScore: number
}

function ScoreDisplay({ homeScore, awayScore }: ScoreDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-3xl font-bold">{homeScore}</span>
      <span className="text-xl font-medium text-muted-foreground">-</span>
      <span className="text-3xl font-bold">{awayScore}</span>
    </div>
  )
}

/**
 * Affichage de l'heure du coup d'envoi pour les matchs à venir
 */
interface KickoffTimeProps {
  time: Date
}

function KickoffTime({ time }: KickoffTimeProps) {
  const hours = time.getHours().toString().padStart(2, "0")
  const minutes = time.getMinutes().toString().padStart(2, "0")

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-2xl font-bold">
        {hours}:{minutes}
      </span>
      <span className="text-xs text-muted-foreground">
        {time.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
        })}
      </span>
    </div>
  )
}
