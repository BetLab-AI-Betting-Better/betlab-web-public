/**
 * Sport Store (Zustand)
 * Basé sur lib/presentation/providers/sport_provider.dart
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SportType } from '@/shared/constants/enums/sport-type';

interface SportState {
  activeSport: SportType;
  setActiveSport: (sport: SportType) => void;
}

export const useSportStore = create<SportState>()(
  persist(
    (set) => ({
      activeSport: SportType.FOOTBALL,
      setActiveSport: (sport: SportType) => set({ activeSport: sport }),
    }),
    {
      name: 'sport-storage',
    }
  )
);
