/**
 * Utilitaires pour grouper les matchs par créneaux horaires
 * Reproduit le comportement de l'app Flutter
 */

import type { Match } from "../match-card-compact";

export type TimeSlot = "Matin (06h-12h)" | "Après-midi (12h-18h)" | "Soirée (18h-00h)" | "Nuit (00h-06h)";

export interface SubTimeSlotGroup {
  label: string; // Ex: "10h00 - 12h15"
  matches: Match[];
}

export interface TimeSlotGroup {
  label: TimeSlot;
  subSlots: SubTimeSlotGroup[];
  totalMatches: number;
}

/**
 * Ordre d'affichage des créneaux horaires
 */
export const TIME_SLOT_ORDER: TimeSlot[] = [
  "Matin (06h-12h)",
  "Après-midi (12h-18h)",
  "Soirée (18h-00h)",
  "Nuit (00h-06h)",
];

/**
 * Détermine le créneau horaire principal pour une heure donnée
 */
function getMainTimeSlot(hour: number): TimeSlot {
  if (hour >= 0 && hour < 6) {
    return "Nuit (00h-06h)";
  } else if (hour >= 6 && hour < 12) {
    return "Matin (06h-12h)";
  } else if (hour >= 12 && hour < 18) {
    return "Après-midi (12h-18h)";
  } else {
    return "Soirée (18h-00h)";
  }
}

/**
 * Génère le label d'un sous-créneau de 2h15
 * Ex: heure=10 -> "10h00 - 12h15"
 */
function getSubTimeSlotLabel(hour: number): string {
  // Arrondir à l'heure paire la plus proche
  const startHour = Math.floor(hour / 2) * 2;
  const endHour = startHour + 2;
  const endMinute = 15; // Durée typique d'un match + marge

  if (endHour < 24) {
    return `${startHour.toString().padStart(2, '0')}h00 - ${endHour.toString().padStart(2, '0')}h${endMinute.toString().padStart(2, '0')}`;
  } else {
    // Gérer le passage à minuit
    return `${startHour.toString().padStart(2, '0')}h00 - ${(endHour - 24).toString().padStart(2, '0')}h${endMinute.toString().padStart(2, '0')}`;
  }
}

/**
 * Groupe les matchs par créneaux horaires principaux et sous-créneaux
 */
export function groupMatchesByTimeSlots(matches: Match[]): TimeSlotGroup[] {
  // Map des créneaux principaux -> sous-créneaux -> matchs
  const groupedByMainSlot = new Map<TimeSlot, Map<string, Match[]>>();

  // Grouper les matchs
  for (const match of matches) {
    const hour = match.kickoffTime.getHours();
    const mainSlot = getMainTimeSlot(hour);
    const subSlotLabel = getSubTimeSlotLabel(hour);

    if (!groupedByMainSlot.has(mainSlot)) {
      groupedByMainSlot.set(mainSlot, new Map());
    }

    const subSlots = groupedByMainSlot.get(mainSlot)!;
    if (!subSlots.has(subSlotLabel)) {
      subSlots.set(subSlotLabel, []);
    }

    subSlots.get(subSlotLabel)!.push(match);
  }

  // Trier les matchs dans chaque sous-créneau par heure
  for (const subSlots of groupedByMainSlot.values()) {
    for (const matches of subSlots.values()) {
      matches.sort((a, b) => a.kickoffTime.getTime() - b.kickoffTime.getTime());
    }
  }

  // Convertir en structure finale
  const result: TimeSlotGroup[] = [];

  for (const mainSlot of TIME_SLOT_ORDER) {
    const subSlotsMap = groupedByMainSlot.get(mainSlot);
    if (!subSlotsMap || subSlotsMap.size === 0) continue;

    const subSlots: SubTimeSlotGroup[] = Array.from(subSlotsMap.entries())
      .map(([label, matches]) => ({ label, matches }))
      .sort((a, b) => {
        // Trier les sous-créneaux par heure de début
        const hourA = parseInt(a.label.split('h')[0]);
        const hourB = parseInt(b.label.split('h')[0]);
        return hourA - hourB;
      });

    const totalMatches = subSlots.reduce((sum, slot) => sum + slot.matches.length, 0);

    result.push({
      label: mainSlot,
      subSlots,
      totalMatches,
    });
  }

  return result;
}
