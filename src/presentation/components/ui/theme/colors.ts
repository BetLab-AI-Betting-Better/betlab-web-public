/**
 * BetLab Design Tokens — Premium Palette v4.0
 */

export const BetLabColors = {
  // Navy (Primaire)
  navy950: '#001A33',
  navy900: '#002244',
  navy800: '#003366',
  navy700: '#0A4A7A',
  navy600: '#1A6AAF',
  navy100: '#E6EFF7',
  navy50: '#F0F5FA',

  // Aliases rétro-compatibles
  navy: '#003366',
  navyLight: '#0A4A7A',
  navyUltraLight: '#E6EFF7',

  // Lime (Accent — adouci)
  lime600: '#A0B530',
  lime500: '#B8CC3A',
  lime400: '#C8DC3F',
  lime300: '#D8EC6F',
  lime200: '#E5F29A',
  lime100: '#F0F7D4',
  lime50: '#F8FBEB',

  // Aliases rétro-compatibles
  lime: '#B8CC3A',
  limeLight: '#D8EC6F',
  limeUltraLight: '#F0F7D4',

  // Neutres (tons chauds)
  gray950: '#0F1419',
  gray800: '#1F2937',
  gray700: '#374151',
  gray500: '#6B7280',
  gray400: '#9CA3AF',
  gray300: '#C5CBD3',
  gray200: '#E2E6EB',
  gray100: '#F1F3F6',
  gray50: '#F8F9FB',

  // Aliases rétro-compatibles
  white: '#FFFFFF',
  background: '#F8F9FB',
  gray: '#6B7280',
  grayLight: '#E2E6EB',
  grayUltraLight: '#F1F3F6',
  textPrimary: '#0F1419',
  textSecondary: '#374151',
  textTertiary: '#9CA3AF',

  // Surfaces
  surfaceElevated: '#FFFFFF',
  surfaceSunken: '#F1F3F6',

  // Sémantiques
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  live: '#DC2626',

  // Prédictions — Edge (Avantage)
  edgeExcellent: '#10B981',
  edgeGood: '#B8CC3A',
  edgeFair: '#F59E0B',
  edgeLow: '#6B7280',

  // Prédictions — Confidence
  confidenceHigh: '#10B981',
  confidenceMedium: '#F59E0B',
  confidenceLow: '#EF4444',

  // Prédictions — Variance
  varianceLow: '#10B981',
  varianceMedium: '#F59E0B',
  varianceHigh: '#EF4444',
} as const;

export const BetLabGradients = {
  navy: `linear-gradient(135deg, ${BetLabColors.navy950}, ${BetLabColors.navy800})`,
  navyHorizontal: `linear-gradient(90deg, ${BetLabColors.navy950}, ${BetLabColors.navy700})`,
  lime: `linear-gradient(135deg, ${BetLabColors.lime500}, ${BetLabColors.lime300})`,
  card: `linear-gradient(180deg, ${BetLabColors.white}, ${BetLabColors.gray50})`,
  header: `linear-gradient(180deg, ${BetLabColors.navy950}, ${BetLabColors.navy800})`,
  sidebar: `linear-gradient(180deg, ${BetLabColors.navy950} 0%, ${BetLabColors.navy900} 50%, ${BetLabColors.navy950} 100%)`,
} as const;

export const BetLabShadows = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
  md: '0 4px 8px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
  lg: '0 10px 24px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
  xl: '0 20px 40px -5px rgba(0, 0, 0, 0.10)',
  // Aliases rétro-compatibles
  card: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
  button: '0 4px 8px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
  modal: '0 20px 40px -5px rgba(0, 0, 0, 0.10)',
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
