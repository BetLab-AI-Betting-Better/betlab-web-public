'use client'

import { Loader2, ArrowDown } from 'lucide-react'

interface PullToRefreshIndicatorProps {
  pullDistance: number
  isRefreshing: boolean
  threshold?: number
}

export function PullToRefreshIndicator({
  pullDistance,
  isRefreshing,
  threshold = 80,
}: PullToRefreshIndicatorProps) {
  const progress = Math.min(pullDistance / threshold, 1)
  const rotation = progress * 360

  return (
    <div
      className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all"
      style={{
        height: pullDistance,
        opacity: progress,
      }}
    >
      <div className="bg-background/90 backdrop-blur-sm rounded-full p-2">
        {isRefreshing ? (
          <Loader2 className="w-5 h-5 animate-spin text-lime" />
        ) : (
          <ArrowDown
            className="w-5 h-5 text-muted-foreground transition-transform"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        )}
      </div>
    </div>
  )
}
