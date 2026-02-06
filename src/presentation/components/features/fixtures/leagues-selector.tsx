"use client"

import Image from "next/image"
import { LayoutGrid, Star } from "lucide-react"
import { cn } from "@/shared/utils"

interface League {
  id: number | string
  name: string
  logo?: string
  matchCount: number
  isPopular?: boolean
}

interface LeaguesSelectorProps {
  leagues: League[]
  selectedLeagueId: number | string | "all" | "favorites"
  onLeagueChange: (leagueId: number | string | "all" | "favorites") => void
}

export function LeaguesSelector({ leagues, selectedLeagueId, onLeagueChange }: LeaguesSelectorProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-0.5">
      {/* Toutes */}
      <button
        onClick={() => onLeagueChange("all")}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 shrink-0",
          "border",
          selectedLeagueId === "all"
            ? "bg-navy text-white border-navy shadow-sm"
            : "bg-white text-gray-600 border-gray-200 hover:border-navy/30 hover:text-navy"
        )}
      >
        <LayoutGrid className="w-3 h-3" />
        Toutes
      </button>

      {/* Favoris */}
      <button
        onClick={() => onLeagueChange("favorites")}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 shrink-0",
          "border",
          selectedLeagueId === "favorites"
            ? "bg-amber-50 text-amber-700 border-amber-300 shadow-sm"
            : "bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-600"
        )}
      >
        <Star className={cn(
          "w-3 h-3",
          selectedLeagueId === "favorites" ? "fill-amber-500" : "fill-none"
        )} />
        Favoris
      </button>

      {/* Separator */}
      <div className="w-px bg-gray-200 self-stretch my-0.5 shrink-0" />

      {/* Leagues */}
      {leagues.map((league) => {
        const isSelected = selectedLeagueId === league.id
        return (
          <button
            key={league.id}
            onClick={() => onLeagueChange(league.id)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 shrink-0",
              "border",
              isSelected
                ? "bg-navy-50 text-navy border-navy/30 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-navy/30 hover:text-navy"
            )}
          >
            {league.logo && (
              <div className="relative w-4 h-4 shrink-0">
                <Image
                  src={league.logo}
                  alt=""
                  fill
                  className="object-contain"
                  loading="lazy"
                  quality={75}
                />
              </div>
            )}
            <span className="truncate max-w-[80px]">{league.name}</span>
            {league.matchCount > 0 && (
              <span className={cn(
                "text-[9px] font-bold tabular-nums min-w-[16px] text-center",
                isSelected ? "text-navy/60" : "text-gray-400"
              )}>
                {league.matchCount}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
