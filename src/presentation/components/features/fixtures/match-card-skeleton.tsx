/**
 * MatchCardSkeleton - Skeleton loader pour MatchCard
 *
 * Affiche un état de chargement animé pendant que les matchs sont récupérés.
 * - Structure identique à MatchCardCompact
 * - Animation pulse
 * - Height: min 120px
 * - Mobile-optimized
 * - Support dark mode
 *
 * @example
 * ```tsx
 * // Affichage de 5 skeletons pendant le chargement
 * {isLoading && Array.from({ length: 5 }).map((_, i) => (
 *   <MatchCardSkeleton key={i} />
 * ))}
 * ```
 */

import * as React from "react"
import { cn } from "@/shared/utils"

export interface MatchCardSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Afficher le star button skeleton
   * @default true
   */
  showFavorite?: boolean
}

const MatchCardSkeleton = React.forwardRef<HTMLDivElement, MatchCardSkeletonProps>(
  ({ className, showFavorite = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative min-h-[120px] p-4 rounded-lg border-2 border-border bg-card",
          className
        )}
        role="status"
        aria-label="Chargement du match..."
        {...props}
      >
        {/* Header: League + Time */}
        <div className="flex items-center justify-between mb-3 animate-pulse">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted rounded-full" />
            <div className="h-3 w-24 bg-muted rounded" />
          </div>
          <div className="h-3 w-12 bg-muted rounded" />
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between gap-4 mb-3 animate-pulse">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 bg-muted rounded-full shrink-0" />
            <div className="h-4 flex-1 bg-muted rounded max-w-[120px]" />
          </div>
          <div className="h-3 w-6 bg-muted rounded" />
          <div className="flex items-center gap-2 flex-1 justify-end">
            <div className="h-4 flex-1 bg-muted rounded max-w-[120px]" />
            <div className="w-8 h-8 bg-muted rounded-full shrink-0" />
          </div>
        </div>

        {/* Prediction placeholder */}
        <div className="h-12 bg-muted rounded animate-pulse" />

        {/* Favorite button skeleton */}
        {showFavorite && (
          <div className="absolute top-2 right-2 w-8 h-8 bg-muted rounded-full animate-pulse" />
        )}

        {/* Screen reader text */}
        <span className="sr-only">Chargement du match...</span>
      </div>
    )
  }
)

MatchCardSkeleton.displayName = "MatchCardSkeleton"

export { MatchCardSkeleton }
