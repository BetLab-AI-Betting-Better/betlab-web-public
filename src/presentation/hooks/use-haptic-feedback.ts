'use client'

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error'

const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 10],
  error: [20, 100, 20, 100, 20],
}

export function useHapticFeedback() {
  const vibrate = (pattern: HapticPattern) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(HAPTIC_PATTERNS[pattern])
    }
  }

  return { vibrate }
}
