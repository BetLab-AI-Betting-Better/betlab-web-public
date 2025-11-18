/**
 * MatchCardSkeleton - État loading pour MatchCard
 *
 * Affiche un skeleton pendant le chargement des données
 */
import * as React from "react"
import { cn } from "@/shared/utils"
import { Card } from "@/presentation/components/ui/card"
import { Skeleton } from "@/presentation/components/ui/skeleton"

interface MatchCardSkeletonProps {
  compact?: boolean
  className?: string
}

export function MatchCardSkeleton({ compact = false, className }: MatchCardSkeletonProps) {
  return (
    <Card
      className={cn(
        "relative w-full overflow-hidden border",
        compact ? "min-h-[100px] p-3" : "min-h-[140px] p-4",
        className
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
      </div>

      {/* Teams */}
      <div className={cn("mb-3 flex items-center justify-between", compact && "mb-2")}>
        {/* Home Team */}
        <div className={cn("flex flex-col items-center gap-1.5", compact ? "w-[30%]" : "w-[35%]")}>
          <Skeleton className={cn("rounded-full", compact ? "h-8 w-8" : "h-12 w-12")} />
          <Skeleton className={cn("h-4", compact ? "w-16" : "w-20")} />
        </div>

        {/* VS */}
        <Skeleton className="h-6 w-12" />

        {/* Away Team */}
        <div className={cn("flex flex-col items-center gap-1.5", compact ? "w-[30%]" : "w-[35%]")}>
          <Skeleton className={cn("rounded-full", compact ? "h-8 w-8" : "h-12 w-12")} />
          <Skeleton className={cn("h-4", compact ? "w-16" : "w-20")} />
        </div>
      </div>

      {/* Footer - Prediction */}
      <div className={cn(
        "flex items-center justify-between gap-2 rounded-lg bg-muted/50 p-2",
        compact && "p-1.5"
      )}>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className={cn("h-4", compact ? "w-16" : "w-24")} />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-16 rounded-md" />
        </div>
      </div>
    </Card>
  )
}

/**
 * MatchCardSkeletonCompact - Version compacte du skeleton
 */
export function MatchCardSkeletonCompact(props: Omit<MatchCardSkeletonProps, 'compact'>) {
  return <MatchCardSkeleton {...props} compact />
}
