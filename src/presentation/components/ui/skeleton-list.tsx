import * as React from "react"
import { cn } from "@/shared/utils"
import { Skeleton } from "./skeleton"

export interface SkeletonListProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number
  variant?: "default" | "with-avatar" | "with-icon" | "detailed"
  showDivider?: boolean
}

const SkeletonList = React.forwardRef<HTMLDivElement, SkeletonListProps>(
  (
    {
      className,
      count = 3,
      variant = "default",
      showDivider = true,
      ...props
    },
    ref
  ) => {
    const items = Array.from({ length: count }, (_, i) => i)

    // List Item avec Avatar
    if (variant === "with-avatar") {
      return (
        <div ref={ref} className={cn("space-y-0", className)} {...props}>
          {items.map((i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-4 py-3">
                <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-20 shrink-0" />
              </div>
              {showDivider && i < count - 1 && <div className="border-b" />}
            </React.Fragment>
          ))}
        </div>
      )
    }

    // List Item avec Icon
    if (variant === "with-icon") {
      return (
        <div ref={ref} className={cn("space-y-0", className)} {...props}>
          {items.map((i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-3 py-3">
                <Skeleton className="h-10 w-10 rounded shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
              {showDivider && i < count - 1 && <div className="border-b" />}
            </React.Fragment>
          ))}
        </div>
      )
    }

    // Detailed List Item
    if (variant === "detailed") {
      return (
        <div ref={ref} className={cn("space-y-0", className)} {...props}>
          {items.map((i) => (
            <React.Fragment key={i}>
              <div className="py-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                  <Skeleton className="h-16 w-16 rounded shrink-0" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-14 rounded-full" />
                </div>
              </div>
              {showDivider && i < count - 1 && <div className="border-b" />}
            </React.Fragment>
          ))}
        </div>
      )
    }

    // Default Simple List
    return (
      <div ref={ref} className={cn("space-y-0", className)} {...props}>
        {items.map((i) => (
          <React.Fragment key={i}>
            <div className="py-3 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            {showDivider && i < count - 1 && <div className="border-b" />}
          </React.Fragment>
        ))}
      </div>
    )
  }
)
SkeletonList.displayName = "SkeletonList"

export { SkeletonList }
