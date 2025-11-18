/**
 * BetLab Colors - Palette de couleurs de l'application
 * Basé sur lib/core/theme/betlab_colors.dart
 */

export const BetLabColors = {
  // Couleurs Primaires (Logo)
  navy: '#003366',
  navyLight: '#0A4A7A',
  navyUltraLight: '#E6EFF7',
  lime: '#C8DC3F',
  limeLight: '#E5F077',
  limeUltraLight: '#F7FCE0',

  // Couleurs Neutres
  white: '#FFFFFF',
  background: '#F8F9FA',
  gray: '#6B7280',
  grayLight: '#E0E0E0',
  grayUltraLight: '#F0F0F0',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',

  // Couleurs Sémantiques
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  live: '#DC2626',

  // Couleurs pour Prédictions - Edge (Avantage)
  edgeExcellent: '#10B981', // > 10%
  edgeGood: '#C8DC3F',      // 5-10%
  edgeFair: '#F59E0B',      // 2-5%
  edgeLow: '#6B7280',       // < 2%

  // Couleurs pour Prédictions - Confidence
  confidenceHigh: '#10B981',
  confidenceMedium: '#F59E0B',
  confidenceLow: '#EF4444',

  // Couleurs pour Prédictions - Variance
  varianceLow: '#10B981',
  varianceMedium: '#F59E0B',
  varianceHigh: '#EF4444',
} as const;

// Gradients
export const BetLabGradients = {
  navy: `linear-gradient(to bottom, ${BetLabColors.navy}, ${BetLabColors.navyLight})`,
  lime: `linear-gradient(to bottom right, ${BetLabColors.lime}, ${BetLabColors.limeLight})`,
  card: `linear-gradient(to bottom right, ${BetLabColors.white}, ${BetLabColors.background})`,
} as const;

// Shadows
export const BetLabShadows = {
  card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  button: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  modal: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

// Helper functions
export const getConfidenceColor = (confidence: 'low' | 'medium' | 'high'): string => {
  switch (confidence) {
    case 'high':
      return BetLabColors.confidenceHigh;
    case 'medium':
      return BetLabColors.confidenceMedium;
    case 'low':
      return BetLabColors.confidenceLow;
  }
};

export const getEdgeColor = (edge: number): string => {
  if (edge > 10) return BetLabColors.edgeExcellent;
  if (edge >= 5) return BetLabColors.edgeGood;
  if (edge >= 2) return BetLabColors.edgeFair;
  return BetLabColors.edgeLow;
};

export const getVarianceColor = (variance: 'low' | 'medium' | 'high'): string => {
  switch (variance) {
    case 'low':
      return BetLabColors.varianceLow;
    case 'medium':
      return BetLabColors.varianceMedium;
    case 'high':
      return BetLabColors.varianceHigh;
  }
};

export type BetLabColorKey = keyof typeof BetLabColors;
