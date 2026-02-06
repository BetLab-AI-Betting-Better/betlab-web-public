"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/shared/utils"

export interface SubTimeSlotHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  matchCount: number
}

export const SubTimeSlotHeader = React.forwardRef<HTMLDivElement, SubTimeSlotHeaderProps>(
  ({ label, matchCount, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2.5 px-1 py-1.5", className)}
        {...props}
      >
        {/* Lime accent bar */}
        <div className="w-[3px] h-4 bg-lime rounded-full" />

        {/* Clock icon */}
        <Clock className="w-3.5 h-3.5 text-navy/50" />

        {/* Time range label */}
        <span className="text-[12px] font-semibold text-navy/70">
          {label}
        </span>

        {/* Match count badge */}
        <span className="text-[10px] font-bold text-navy bg-navy-50 px-2 py-0.5 rounded-full tabular-nums">
          {matchCount}
        </span>
      </div>
    )
  }
)

SubTimeSlotHeader.displayName = "SubTimeSlotHeader"
