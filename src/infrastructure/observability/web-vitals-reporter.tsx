/**
 * Web Vitals Reporter Component
 *
 * Composant client pour reporter les Web Vitals
 * À inclure dans le layout root
 */

'use client';

import { useEffect } from 'react';
import { reportWebVitals } from '@/shared/utils/performance';

export function WebVitalsReporter() {
  useEffect(() => {
    // Active le reporting des Web Vitals
    reportWebVitals();
  }, []);

  return null;
}
