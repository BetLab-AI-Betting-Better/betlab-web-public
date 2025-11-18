/**
 * Confidence Level Enum
 * Basé sur lib/core/utils/confidence_calculator.dart
 */

export enum ConfidenceLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export const ConfidenceLevelConfig = {
  [ConfidenceLevel.LOW]: {
    label: 'Faible',
    color: '#EF4444',
    minPercentage: 0,
    maxPercentage: 33,
  },
  [ConfidenceLevel.MEDIUM]: {
    label: 'Moyen',
    color: '#F59E0B',
    minPercentage: 34,
    maxPercentage: 66,
  },
  [ConfidenceLevel.HIGH]: {
    label: 'Élevé',
    color: '#10B981',
    minPercentage: 67,
    maxPercentage: 100,
  },
} as const;

export type ConfidenceLevelKey = keyof typeof ConfidenceLevel;
