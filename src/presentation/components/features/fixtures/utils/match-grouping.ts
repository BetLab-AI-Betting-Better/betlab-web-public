/**
 * Utilitaires pour grouper les matchs par cr?neaux horaires
 * Reproduit le comportement de l'app Flutter
 */

import type { MatchCardVM } from "@/application/view-models/fixtures/match-card.vm"

export type TimeSlot =
  | "Matin (06h-12h)"
  | "Apr?s-midi (12h-18h)"
  | "Soir?e (18h-00h)"
  | "Nuit (00h-06h)"

export interface SubTimeSlotGroup {
  label: string
  matches: MatchCardVM[]
}

export interface TimeSlotGroup {
  label: TimeSlot
  subSlots: SubTimeSlotGroup[]
  totalMatches: number
}

export const TIME_SLOT_ORDER: TimeSlot[] = [
  "Matin (06h-12h)",
  "Apr?s-midi (12h-18h)",
  "Soir?e (18h-00h)",
  "Nuit (00h-06h)",
]

function getMainTimeSlot(hour: number): TimeSlot {
  if (hour >= 0 && hour < 6) {
    return "Nuit (00h-06h)"
  } else if (hour >= 6 && hour < 12) {
    return "Matin (06h-12h)"
  } else if (hour >= 12 && hour < 18) {
    return "Apr?s-midi (12h-18h)"
  }
  return "Soir?e (18h-00h)"
}

function getSubTimeSlotLabel(hour: number): string {
  const startHour = Math.floor(hour / 2) * 2
  const endHour = startHour + 2
  const endMinute = 15

  if (endHour < 24) {
    return `${startHour.toString().padStart(2, "0")}h00 - ${endHour
      .toString()
      .padStart(2, "0")}h${endMinute.toString().padStart(2, "0")}`
  }
  return `${startHour.toString().padStart(2, "0")}h00 - ${(endHour - 24)
    .toString()
    .padStart(2, "0")}h${endMinute.toString().padStart(2, "0")}`
}

export function groupMatchesByTimeSlots(matches: MatchCardVM[]): TimeSlotGroup[] {
  const groupedByMainSlot = new Map<TimeSlot, Map<string, MatchCardVM[]>>()

  for (const match of matches) {
    const hour = match.kickoffTime.getHours()
    const mainSlot = getMainTimeSlot(hour)
    const subSlotLabel = getSubTimeSlotLabel(hour)

    if (!groupedByMainSlot.has(mainSlot)) {
      groupedByMainSlot.set(mainSlot, new Map())
    }

    const subSlots = groupedByMainSlot.get(mainSlot)!
    if (!subSlots.has(subSlotLabel)) {
      subSlots.set(subSlotLabel, [])
    }

    subSlots.get(subSlotLabel)!.push(match)
  }

  for (const subSlots of groupedByMainSlot.values()) {
    for (const matchesSlot of subSlots.values()) {
      matchesSlot.sort(
        (a, b) => a.kickoffTime.getTime() - b.kickoffTime.getTime()
      )
    }
  }

  const result: TimeSlotGroup[] = []

  for (const mainSlot of TIME_SLOT_ORDER) {
    const subSlotsMap = groupedByMainSlot.get(mainSlot)
    if (!subSlotsMap || subSlotsMap.size === 0) continue

    const subSlots: SubTimeSlotGroup[] = Array.from(subSlotsMap.entries())
      .map(([label, matchesSlot]) => ({ label, matches: matchesSlot }))
      .sort((a, b) => {
        const hourA = parseInt(a.label.split("h")[0])
        const hourB = parseInt(b.label.split("h")[0])
        return hourA - hourB
      })

    const totalMatches = subSlots.reduce(
      (sum, slot) => sum + slot.matches.length,
      0
    )

    result.push({
      label: mainSlot,
      subSlots,
      totalMatches,
    })
  }

  return result
}
