"use client"

import Image from "next/image"
import { Grid3x3, Star } from "lucide-react"
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
    <div className="h-[90px] overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 px-4">
        {/* Toutes */}
        <button
          onClick={() => onLeagueChange("all")}
          className="flex flex-col items-center shrink-0 w-16 touch-manipulation"
        >
          <div
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200",
              "border-2",
              selectedLeagueId === "all"
                ? "bg-[var(--lime)]/15 border-[var(--lime)]"
                : "bg-transparent border-[var(--navy)]"
            )}
          >
            <Grid3x3
              className={cn(
                "w-8 h-8",
                selectedLeagueId === "all" ? "text-[var(--lime)]" : "text-[var(--navy)]"
              )}
            />
          </div>
          <span
            className={cn(
              "text-[10px] mt-1 text-center",
              selectedLeagueId === "all"
                ? "font-bold text-[var(--lime)]"
                : "font-normal text-[var(--text-secondary)]"
            )}
          >
            Toutes
          </span>
        </button>

        {/* Favoris */}
        <button
          onClick={() => onLeagueChange("favorites")}
          className="flex flex-col items-center shrink-0 w-16 touch-manipulation"
        >
          <div
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200",
              "border-2",
              selectedLeagueId === "favorites"
                ? "bg-[var(--lime)]/15 border-[var(--lime)]"
                : "bg-transparent border-[var(--navy)]"
            )}
          >
            <Star
              className={cn(
                "w-8 h-8",
                selectedLeagueId === "favorites" ? "text-[var(--lime)] fill-[var(--lime)]" : "text-amber-500 fill-amber-500"
              )}
            />
          </div>
          <span
            className={cn(
              "text-[10px] mt-1 text-center",
              selectedLeagueId === "favorites"
                ? "font-bold text-[var(--lime)]"
                : "font-normal text-[var(--text-secondary)]"
            )}
          >
            Favoris
          </span>
        </button>

        {/* Leagues */}
        {leagues.map((league) => {
          const isSelected = selectedLeagueId === league.id
          return (
            <button
              key={league.id}
              onClick={() => onLeagueChange(league.id)}
              className="flex flex-col items-center shrink-0 w-20 touch-manipulation"
            >
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200",
                  "border-2",
                  isSelected
                    ? "bg-[var(--lime)]/15 border-[var(--lime)]"
                    : "bg-transparent border-[var(--navy)]"
                )}
              >
                {league.logo ? (
                  <div className="relative w-10 h-10">
                    <Image
                      src={league.logo}
                      alt={league.name}
                      fill
                      className="object-contain"
                      loading="lazy"
                      quality={75}
                    />
                  </div>
                ) : (
                  <Grid3x3
                    className={cn(
                      "w-8 h-8",
                      isSelected ? "text-[var(--lime)]" : "text-[var(--navy)]"
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-[9px] mt-1 text-center line-clamp-1 w-full",
                  isSelected
                    ? "font-bold text-[var(--lime)]"
                    : "font-normal text-[var(--text-secondary)]"
                )}
              >
                {league.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
