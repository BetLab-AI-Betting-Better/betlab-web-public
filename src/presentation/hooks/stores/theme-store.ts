/**
 * Theme Store (Zustand)
 * Basé sur lib/presentation/providers/theme_provider.dart
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeMode: 'system',
      setThemeMode: (mode: ThemeMode) => set({ themeMode: mode }),
    }),
    {
      name: 'theme-storage',
    }
  )
);
