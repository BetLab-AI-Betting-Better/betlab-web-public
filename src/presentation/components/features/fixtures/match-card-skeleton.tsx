import * as React from "react"
import { cn } from "@/shared/utils"

export interface MatchCardSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  showFavorite?: boolean
}

const MatchCardSkeleton = React.forwardRef<HTMLDivElement, MatchCardSkeletonProps>(
  ({ className, showFavorite = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative min-h-[120px] p-4 rounded-xl border border-gray-200/60 bg-surface-elevated shadow-sm",
          className
        )}
        role="status"
        aria-label="Chargement du match..."
        {...props}
      >
        {/* Header: League + Time */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-gray-100 rounded-full animate-shimmer" />
            <div className="h-3 w-24 bg-gray-100 rounded-md animate-shimmer" />
          </div>
          <div className="h-3 w-12 bg-gray-100 rounded-md animate-shimmer" />
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-9 h-9 bg-gray-100 rounded-lg animate-shimmer" />
            <div className="h-4 flex-1 bg-gray-100 rounded-md max-w-[100px] animate-shimmer" />
          </div>
          <div className="h-3 w-6 bg-gray-100 rounded-md animate-shimmer" />
          <div className="flex items-center gap-2.5 flex-1 justify-end">
            <div className="h-4 flex-1 bg-gray-100 rounded-md max-w-[100px] animate-shimmer" />
            <div className="w-9 h-9 bg-gray-100 rounded-lg animate-shimmer" />
          </div>
        </div>

        {/* Probability bar */}
        <div className="h-7 bg-gray-100 rounded-lg animate-shimmer" />

        {/* Favorite button */}
        {showFavorite && (
          <div className="absolute top-2 right-2 w-8 h-8 bg-gray-100 rounded-full animate-shimmer" />
        )}

        <span className="sr-only">Chargement du match...</span>
      </div>
    )
  }
)

MatchCardSkeleton.displayName = "MatchCardSkeleton"

export { MatchCardSkeleton }
