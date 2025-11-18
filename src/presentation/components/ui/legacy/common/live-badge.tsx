/**
 * LiveBadge - Badge indiquant qu'un match est en cours
 *
 * Badge animé avec pulsation pour les matchs live
 */
import * as React from "react"
import { cn } from "@/shared/utils"

interface LiveBadgeProps {
  className?: string
  pulse?: boolean
}

export function LiveBadge({ className, pulse = true }: LiveBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white",
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
        </span>
      )}
      <span>LIVE</span>
    </div>
  )
}
