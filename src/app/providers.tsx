'use client';

/**
 * Global application providers.
 * Only essential providers here. Route-specific providers go in route group layouts.
 */

import type { ReactNode } from 'react';
import { ThemeProvider } from '@/presentation/components/providers/theme-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
