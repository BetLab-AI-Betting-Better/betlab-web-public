"use client"

/**
 * SubTimeSlotHeader - Header pour les sous-créneaux horaires (ex: "10h00 - 12h15")
 *
 * Affiche un header visuel pour regrouper les matchs par créneaux de 2h
 * Style inspiré de l'app Flutter
 */

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/shared/utils"

export interface SubTimeSlotHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Label du sous-créneau (ex: "10h00 - 12h15")
   */
  label: string

  /**
   * Nombre de matchs dans ce créneau
   */
  matchCount: number
}

export const SubTimeSlotHeader = React.forwardRef<HTMLDivElement, SubTimeSlotHeaderProps>(
  ({ label, matchCount, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 px-4 py-2", className)}
        {...props}
      >
        {/* Barre verticale lime */}
        <div className="w-[3px] h-5 bg-[var(--lime)] rounded-full" />

        {/* Icône horloge */}
        <Clock className="w-3.5 h-3.5 text-[var(--navy)] opacity-60" />

        {/* Label du créneau */}
        <span className="text-[13px] font-semibold text-[var(--navy)] opacity-80">
          {label}
        </span>

        {/* Badge compteur */}
        <div className="px-2 py-0.5 rounded-md bg-[var(--lime)] text-[var(--navy)] text-[11px] font-bold">
          {matchCount}
        </div>
      </div>
    )
  }
)

SubTimeSlotHeader.displayName = "SubTimeSlotHeader"
