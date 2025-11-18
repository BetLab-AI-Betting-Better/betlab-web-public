"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, addDays, isSameDay } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/shared/utils"

interface CalendarWidgetProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  matchCountsByDate?: { [date: string]: number } // key: YYYY-MM-DD, value: count
}

export function CalendarWidget({ selectedDate, onDateChange, matchCountsByDate }: CalendarWidgetProps) {
  const [centerDate, setCenterDate] = useState(new Date())

  // Generate 7 days array (centerDate ± 3)
  const days = Array.from({ length: 7 }, (_, i) => addDays(centerDate, i - 3))

  return (
    <div className="space-y-2">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between px-4">
        <button
          onClick={() => setCenterDate(addDays(centerDate, -7))}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Semaine précédente"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            setCenterDate(new Date())
            onDateChange(new Date())
          }}
          className="text-sm font-medium text-lime hover:text-lime/80 transition-colors"
        >
          Aujourd&apos;hui
        </button>
        <button
          onClick={() => setCenterDate(addDays(centerDate, 7))}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Semaine suivante"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Days scroll */}
      <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory px-4 scrollbar-hide">
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate)
          const dateKey = format(day, "yyyy-MM-dd")
          const matchCount = matchCountsByDate?.[dateKey] || 0

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateChange(day)}
              className={cn(
                "flex-shrink-0 snap-center w-16 h-20 rounded-lg flex flex-col items-center justify-center gap-1 transition-all",
                isSelected
                  ? "bg-lime text-navy scale-105"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
              aria-label={format(day, "EEEE d MMMM yyyy", { locale: fr })}
              aria-pressed={isSelected}
            >
              <span className="text-xs font-medium capitalize">
                {format(day, "EEE", { locale: fr })}
              </span>
              <span className="text-xl font-bold">
                {format(day, "d")}
              </span>
              {matchCount > 0 && (
                <span className={cn(
                  "text-xs px-1.5 rounded-full",
                  isSelected ? "bg-navy text-lime" : "bg-lime/20 text-lime"
                )}>
                  {matchCount}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
