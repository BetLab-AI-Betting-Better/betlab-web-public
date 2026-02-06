"use client"

import * as React from "react"
import { useInView } from "react-intersection-observer"
import { MatchCardCompact, type Match } from "./match-card-compact"
import { MatchCardSkeleton } from "./match-card-skeleton"
import { groupMatchesByTimeSlots } from "./utils/match-grouping"
import { Clock } from "lucide-react"
import { cn } from "@/shared/utils"

export interface MatchListProps extends React.HTMLAttributes<HTMLDivElement> {
  matches: Match[]
  isLoading?: boolean
  onMatchClick: (matchId: string) => void
  onFavoriteToggle?: (matchId: string) => void
  emptyMessage?: string
  skeletonCount?: number
}

const MatchList = React.forwardRef<HTMLDivElement, MatchListProps>(
  (
    {
      matches,
      isLoading = false,
      onMatchClick,
      onFavoriteToggle,
      emptyMessage = "Aucun match trouve pour les filtres selectionnes",
      skeletonCount = 6,
      className,
      ...props
    },
    ref
  ) => {
    const timeSlotGroups = React.useMemo(() => {
      return groupMatchesByTimeSlots(matches)
    }, [matches])

    const { ref: inViewRef, inView } = useInView({
      threshold: 0,
      triggerOnce: true,
      rootMargin: "200px",
    })

    if (isLoading) {
      return (
        <div ref={ref} className={cn("grid grid-cols-[repeat(auto-fill,minmax(300px,340px))] gap-3", className)} {...props}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <MatchCardSkeleton key={i} />
          ))}
        </div>
      )
    }

    if (matches.length === 0) {
      return (
        <div
          ref={ref}
          className={cn("text-center py-16", className)}
          {...props}
        >
          <EmptyState message={emptyMessage} />
        </div>
      )
    }

    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        {timeSlotGroups.map((timeSlot) => (
          <section key={timeSlot.label} className="space-y-3">
            {/* Time slot divider */}
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                {timeSlot.label}
              </span>
              <div className="flex-1 h-px bg-gray-200/80" />
              <span className="text-[11px] font-bold text-navy bg-navy-50 px-2.5 py-0.5 rounded-full tabular-nums shrink-0">
                {timeSlot.totalMatches} match{timeSlot.totalMatches !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Sub-slots with grid */}
            {timeSlot.subSlots.map((subSlot) => (
              <div key={subSlot.label} className="space-y-2">
                {/* Sub-slot time label */}
                <div className="flex items-center gap-2 pl-1">
                  <Clock className="w-3 h-3 text-navy/40" />
                  <span className="text-[11px] font-medium text-navy/50">
                    {subSlot.label}
                  </span>
                </div>

                {/* Match grid */}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,340px))] gap-3">
                  {subSlot.matches.map((match) => (
                    <MatchCardCompact
                      key={match.id}
                      match={match}
                      onClick={() => onMatchClick(match.id)}
                      onFavoriteToggle={onFavoriteToggle ? () => onFavoriteToggle(match.id) : undefined}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}

        {/* Lazy loading trigger */}
        <div ref={inViewRef} className="h-4" aria-hidden="true" />

        {inView && timeSlotGroups.length > 0 && (
          <div className="text-center py-4">
            <span className="text-[11px] text-gray-400">
              Tous les matchs sont charges
            </span>
          </div>
        )}
      </div>
    )
  }
)

MatchList.displayName = "MatchList"

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-300"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
      </div>

      <div className="space-y-1 text-center">
        <h3 className="text-sm font-semibold text-text-primary">Aucun match</h3>
        <p className="text-[12px] text-gray-400 max-w-[240px]">
          {message}
        </p>
        <p className="text-[11px] text-gray-400 pt-1">
          Modifiez vos filtres ou selectionnez une autre date
        </p>
      </div>
    </div>
  )
}

export { MatchList }
