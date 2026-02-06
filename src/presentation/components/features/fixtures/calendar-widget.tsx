"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { format, addDays, isSameDay, isToday } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/shared/utils"

interface CalendarWidgetProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  matchCountsByDate?: { [date: string]: number }
}

export function CalendarWidget({ selectedDate, onDateChange, matchCountsByDate }: CalendarWidgetProps) {
  const [centerDate, setCenterDate] = useState(new Date())

  const days = Array.from({ length: 7 }, (_, i) => addDays(centerDate, i - 3))

  const totalMatchesForWeek = days.reduce((sum, day) => {
    const key = format(day, "yyyy-MM-dd")
    return sum + (matchCountsByDate?.[key] || 0)
  }, 0)

  return (
    <div className="max-w-lg mx-auto bg-surface-elevated rounded-xl border border-gray-200/60 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-navy" />
          <span className="text-sm font-semibold text-text-primary capitalize">
            {format(centerDate, "MMMM yyyy", { locale: fr })}
          </span>
          {totalMatchesForWeek > 0 && (
            <span className="text-[10px] font-bold text-navy bg-navy-50 px-2 py-0.5 rounded-full tabular-nums">
              {totalMatchesForWeek} matchs
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setCenterDate(new Date())
              onDateChange(new Date())
            }}
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-200",
              isSameDay(selectedDate, new Date())
                ? "bg-navy text-white"
                : "text-navy hover:bg-navy-50"
            )}
          >
            Aujourd&apos;hui
          </button>
          <button
            onClick={() => setCenterDate(addDays(centerDate, -7))}
            className="p-1.5 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Semaine précédente"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCenterDate(addDays(centerDate, 7))}
            className="p-1.5 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Semaine suivante"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days strip */}
      <div className="flex justify-center px-4 py-3 gap-1.5">
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate)
          const isDayToday = isToday(day)
          const dateKey = format(day, "yyyy-MM-dd")
          const matchCount = matchCountsByDate?.[dateKey] || 0

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateChange(day)}
              className={cn(
                "w-12 flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/20",
                isSelected
                  ? "bg-navy text-white shadow-md"
                  : isDayToday
                    ? "bg-lime-50 text-navy hover:bg-lime-100"
                    : "text-gray-500 hover:bg-gray-50"
              )}
              aria-label={format(day, "EEEE d MMMM yyyy", { locale: fr })}
              aria-pressed={isSelected}
            >
              <span className={cn(
                "text-[10px] font-medium uppercase tracking-wider",
                isSelected ? "text-white/60" : isDayToday ? "text-lime-600" : "text-gray-400"
              )}>
                {format(day, "EEE", { locale: fr })}
              </span>

              <span className={cn(
                "text-lg font-bold tabular-nums leading-none",
                isSelected ? "text-white" : "text-text-primary"
              )}>
                {format(day, "d")}
              </span>

              {/* Match count dot / badge */}
              {matchCount > 0 ? (
                <span className={cn(
                  "text-[9px] font-bold px-1.5 py-0.5 rounded-full tabular-nums min-w-[20px] text-center leading-none",
                  isSelected
                    ? "bg-lime text-navy-950"
                    : "bg-navy-50 text-navy"
                )}>
                  {matchCount}
                </span>
              ) : (
                <span className="h-[17px]" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
