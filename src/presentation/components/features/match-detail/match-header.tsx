"use client"

import { Heart, ShieldCheck } from "lucide-react"
import Image from "next/image"
import { cn } from "@/shared/utils"
import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity"
import type { MatchResultPrediction } from "@/core/entities/predictions/prediction.entity"
import type { MatchDetailVM } from "@/application/view-models/match-detail/match-detail.vm"
import { getMatchConfidence, getMatchPrediction } from "@/application/view-models/match-detail/match-detail.selectors"

interface MatchHeaderProps {
  match: MatchDetail
  vm?: MatchDetailVM
}

/**
 * Header sticky premium du match — gradient navy avec impact visuel
 * Mobile-first avec touch targets >= 44px
 */
export function MatchHeader({ match, vm }: MatchHeaderProps) {
  const isLive = match.status === "live"
  const isFinished = match.status === "finished"
  const isScheduled = match.status === "scheduled"
  const leagueLogo = (match.league.logo || "").trim() || "/globe.svg"
  const homeLogo = (match.homeTeam.logo || "").trim() || "/icon-32.png"
  const awayLogo = (match.awayTeam.logo || "").trim() || "/icon-32.png"

  const mainPrediction = getMatchPrediction(match)
  const confidence = vm?.header.confidence ?? getMatchConfidence(match, mainPrediction ?? undefined)

  return (
    <div className="sticky top-0 z-50 gradient-header shadow-xl">
      {/* Safe area pour iOS notch */}
      <div className="h-[env(safe-area-inset-top)]" />

      <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
        {/* League Info + Favorite + Confidence Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded bg-white/10 p-0.5 backdrop-blur-sm">
              <Image
                src={leagueLogo}
                alt={match.league.name}
                fill
                className="object-contain"
                sizes="24px"
              />
            </div>
            <span className="text-xs text-white/80 font-medium tracking-wide">
              {match.league.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {confidence && (
              <div className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                confidence === "high" ? "bg-green-500/20 border-green-400/30 text-green-300" :
                  confidence === "medium" ? "bg-yellow-500/20 border-yellow-400/30 text-yellow-300" :
                    "bg-red-500/20 border-red-400/30 text-red-300"
              )}>
                <ShieldCheck size={12} />
                <span>{confidence === "high" ? "Confiant" : confidence === "medium" ? "Moyen" : "Risqué"}</span>
              </div>
            )}

            <button
              className={cn(
                "flex items-center justify-center",
                "w-9 h-9 rounded-full",
                "bg-white/10 hover:bg-white/20",
                "transition-all duration-200",
                "active:scale-95"
              )}
              aria-label="Ajouter aux favoris"
            >
              <Heart className="w-4 h-4 text-white/70" />
            </button>
          </div>
        </div>

        {/* Teams + Score/Time */}
        <div className="flex items-center justify-between gap-2 md:gap-8">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <div className="relative w-16 h-16 rounded-2xl bg-white/5 p-2 shadow-2xl ring-1 ring-white/10">
              <Image
                src={homeLogo}
                alt={match.homeTeam.name}
                fill
                className="object-contain p-1.5"
                sizes="64px"
                priority
              />
            </div>
            <span className="text-sm font-bold text-white text-center line-clamp-2 leading-tight max-w-[120px]">
              {match.homeTeam.name}
            </span>
          </div>

          {/* Center */}
          <div className="flex flex-col items-center justify-center gap-1 min-w-[100px] z-10">
            {isLive && <LiveBadge elapsed={match.elapsed} />}

            {isLive && match.score && (
              <ScoreDisplay homeScore={match.score.home ?? 0} awayScore={match.score.away ?? 0} isLive />
            )}

            {isFinished && match.score && (
              <>
                <ScoreDisplay homeScore={match.score.home ?? 0} awayScore={match.score.away ?? 0} />
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-1">
                  Terminé
                </span>
              </>
            )}

            {isScheduled && <KickoffTime time={match.kickoffTime} />}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <div className="relative w-16 h-16 rounded-2xl bg-white/5 p-2 shadow-2xl ring-1 ring-white/10">
              <Image
                src={awayLogo}
                alt={match.awayTeam.name}
                fill
                className="object-contain p-1.5"
                sizes="64px"
                priority
              />
            </div>
            <span className="text-sm font-bold text-white text-center line-clamp-2 leading-tight max-w-[120px]">
              {match.awayTeam.name}
            </span>
          </div>
        </div>

        {/* Venue & Referee */}
        {(match.venue || match.referee) && (
          <div className="flex items-center justify-center gap-3 text-[10px] text-white/40 font-medium tracking-wide">
            {match.venue && <span>{match.venue}</span>}
            {match.venue && match.referee && <span className="text-white/20">•</span>}
            {match.referee && <span>{match.referee}</span>}
          </div>
        )}
      </div>

      {/* Decorative background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
    </div>
  )
}

function LiveBadge({ elapsed }: { elapsed?: number }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-red-500/90 backdrop-blur-md rounded-full animate-pulse shadow-lg mb-1">
      <div className="w-1.5 h-1.5 bg-white rounded-full" />
      <span className="text-[10px] font-bold text-white uppercase tracking-wider leading-none">
        {elapsed ? `${elapsed}'` : "Live"}
      </span>
    </div>
  )
}

interface ScoreDisplayProps {
  homeScore: number
  awayScore: number
  isLive?: boolean
}

function ScoreDisplay({ homeScore, awayScore, isLive }: ScoreDisplayProps) {
  return (
    <div className={cn("flex items-center gap-4", isLive ? "scale-110" : "")}>
      <span className="text-5xl font-black text-white tabular-nums drop-shadow-lg">{homeScore}</span>
      <span className="text-xl font-medium text-white/20">-</span>
      <span className="text-5xl font-black text-white tabular-nums drop-shadow-lg">{awayScore}</span>
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
    <div className="flex flex-col items-center gap-0.5 bg-white/5 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/5">
      <span className="text-3xl font-black text-white tabular-nums tracking-tight">
        {hours}:{minutes}
      </span>
      <span className="text-[10px] text-white/60 font-medium uppercase tracking-wider">
        {time.toLocaleDateString("fr-FR", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })}
      </span>
    </div>
  )
}
