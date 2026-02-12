"use client"

import * as React from "react"
import { MatchCardCompact } from "./match-card-compact"
import type { MatchCardVM } from "@/application/view-models/fixtures/match-card.vm"
import { cn } from "@/shared/utils"

export interface HorizontalMatchListProps extends React.HTMLAttributes<HTMLDivElement> {
  matches: MatchCardVM[]
  onMatchClick: (matchId: string) => void
  onFavoriteToggle?: (matchId: string) => void
  snapScroll?: boolean
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
    return (
      <div
        ref={ref}
        className={cn("relative w-full", className)}
        style={{ height }}
        {...props}
      >
        {/* Scroll Container */}
        <div
          className={cn(
            "flex gap-3 overflow-x-auto pb-1 pl-1",
            "scrollbar-hide",
            snapScroll && "snap-x snap-mandatory"
          )}
        >
          {matches.map((match) => (
            <div
              key={match.id}
              className={cn(
                "flex-shrink-0 w-[320px]",
                snapScroll && "snap-start"
              )}
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
