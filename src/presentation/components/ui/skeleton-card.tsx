import * as React from "react"
import { cn } from "@/shared/utils"
import { Skeleton } from "./skeleton"

export interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "match" | "stat" | "team" | "default"
  showImage?: boolean
  showActions?: boolean
}

const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  (
    {
      className,
      variant = "default",
      showImage = true,
      showActions = false,
      ...props
    },
    ref
  ) => {
    // Match Card Skeleton (pour cards de matchs sportifs)
    if (variant === "match") {
      return (
        <div
          ref={ref}
          className={cn("rounded-lg border bg-card p-4 space-y-4", className)}
          {...props}
        >
          {/* Header avec date/heure */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Teams */}
          <div className="space-y-3">
            {/* Team 1 */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-8 ml-auto" />
            </div>

            {/* VS */}
            <div className="flex justify-center">
              <Skeleton className="h-4 w-12" />
            </div>

            {/* Team 2 */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-8 ml-auto" />
            </div>
          </div>

          {/* Footer avec actions */}
          {showActions && (
            <div className="flex gap-2 pt-2 border-t">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 flex-1" />
            </div>
          )}
        </div>
      )
    }

    // Stat Card Skeleton (pour statistiques)
    if (variant === "stat") {
      return (
        <div
          ref={ref}
          className={cn("rounded-lg border bg-card p-4 space-y-3", className)}
          {...props}
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-full" />
        </div>
      )
    }

    // Team Card Skeleton (pour cards d'équipe)
    if (variant === "team") {
      return (
        <div
          ref={ref}
          className={cn("rounded-lg border bg-card p-4 space-y-4", className)}
          {...props}
        >
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-2 border-t">
            <div className="text-center space-y-1">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>
            <div className="text-center space-y-1">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>
            <div className="text-center space-y-1">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        </div>
      )
    }

    // Default Card Skeleton
    return (
      <div
        ref={ref}
        className={cn("rounded-lg border bg-card p-4 space-y-4", className)}
        {...props}
      >
        {showImage && <Skeleton className="h-48 w-full rounded-md" />}
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        {showActions && (
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        )}
      </div>
    )
  }
)
SkeletonCard.displayName = "SkeletonCard"

export { SkeletonCard }
