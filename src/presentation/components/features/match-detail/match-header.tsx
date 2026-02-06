"use client"

import { Heart } from "lucide-react"
import Image from "next/image"
import { cn } from "@/shared/utils"
import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity"

interface MatchHeaderProps {
  match: MatchDetail
}

/**
 * Header sticky premium du match — gradient navy avec impact visuel
 * Mobile-first avec touch targets >= 44px
 */
export function MatchHeader({ match }: MatchHeaderProps) {
  const isLive = match.status === "live"
  const isFinished = match.status === "finished"
  const isScheduled = match.status === "scheduled"
  const leagueLogo = (match.league.logo || "").trim() || "/globe.svg"
  const homeLogo = (match.homeTeam.logo || "").trim() || "/icon-32.png"
  const awayLogo = (match.awayTeam.logo || "").trim() || "/icon-32.png"

  return (
    <div className="sticky top-0 z-50 gradient-header">
      {/* Safe area pour iOS notch */}
      <div className="h-[env(safe-area-inset-top)]" />

      <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
        {/* League Info + Favorite */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-5 h-5 rounded bg-white/10 p-0.5">
              <Image
                src={leagueLogo}
                alt={match.league.name}
                fill
                className="object-contain"
                sizes="20px"
              />
            </div>
            <span className="text-xs text-white/60 font-medium">
              {match.league.name}
            </span>
          </div>

          <button
            className={cn(
              "flex items-center justify-center",
              "w-10 h-10 rounded-full",
              "bg-white/10 hover:bg-white/15",
              "transition-all duration-200",
              "active:scale-95"
            )}
            aria-label="Ajouter aux favoris"
          >
            <Heart className="w-[18px] h-[18px] text-white/70" />
          </button>
        </div>

        {/* Teams + Score/Time */}
        <div className="flex items-center justify-between gap-3">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="relative w-14 h-14 rounded-2xl bg-white/10 p-2 shadow-lg">
              <Image
                src={homeLogo}
                alt={match.homeTeam.name}
                fill
                className="object-contain p-1"
                sizes="56px"
                priority
              />
            </div>
            <span className="text-sm font-semibold text-white text-center line-clamp-1">
              {match.homeTeam.name}
            </span>
          </div>

          {/* Center */}
          <div className="flex flex-col items-center justify-center gap-1.5 min-w-[90px]">
            {isLive && <LiveBadge />}

            {isLive && match.score && (
              <ScoreDisplay homeScore={match.score.home} awayScore={match.score.away} />
            )}

            {isFinished && match.score && (
              <>
                <ScoreDisplay homeScore={match.score.home} awayScore={match.score.away} />
                <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
                  Terminé
                </span>
              </>
            )}

            {isScheduled && <KickoffTime time={match.kickoffTime} />}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="relative w-14 h-14 rounded-2xl bg-white/10 p-2 shadow-lg">
              <Image
                src={awayLogo}
                alt={match.awayTeam.name}
                fill
                className="object-contain p-1"
                sizes="56px"
                priority
              />
            </div>
            <span className="text-sm font-semibold text-white text-center line-clamp-1">
              {match.awayTeam.name}
            </span>
          </div>
        </div>

        {/* Venue & Referee */}
        {(match.venue || match.referee) && (
          <div className="flex items-center justify-center gap-3 text-[11px] text-white/35">
            {match.venue && <span>{match.venue}</span>}
            {match.venue && match.referee && <span className="text-white/20">|</span>}
            {match.referee && <span>{match.referee}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

function LiveBadge() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-live rounded-full animate-live-glow">
      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
      <span className="text-[10px] font-bold text-white uppercase tracking-wider">
        Live
      </span>
    </div>
  )
}

interface ScoreDisplayProps {
  homeScore: number
  awayScore: number
}

function ScoreDisplay({ homeScore, awayScore }: ScoreDisplayProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-4xl font-bold text-white tabular-nums">{homeScore}</span>
      <span className="text-lg font-medium text-white/30">-</span>
      <span className="text-4xl font-bold text-white tabular-nums">{awayScore}</span>
    </div>
  )
}

interface KickoffTimeProps {
  time: Date
}

function KickoffTime({ time }: KickoffTimeProps) {
  const hours = time.getHours().toString().padStart(2, "0")
  const minutes = time.getMinutes().toString().padStart(2, "0")

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl font-bold text-white tabular-nums tracking-tight">
        {hours}:{minutes}
      </span>
      <span className="text-[11px] text-white/40 font-medium">
        {time.toLocaleDateString("fr-FR", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })}
      </span>
    </div>
  )
}
