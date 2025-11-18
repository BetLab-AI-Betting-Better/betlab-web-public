/**
 * Lazy Loading Components
 *
 * Wrapper pour lazy loading des composants lourds
 * Optimise les performances en chargeant les composants à la demande
 */

'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/presentation/components/ui/skeleton';

/**
 * Skeletons pour loading states
 */
export function ChartSkeleton() {
  return (
    <div className="h-[300px] w-full bg-muted animate-pulse rounded-lg" />
  );
}

export function AnalysisTabSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[150px] w-full" />
      <Skeleton className="h-[150px] w-full" />
    </div>
  );
}

export function H2HTabSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-[100px] w-full" />
      <Skeleton className="h-[100px] w-full" />
      <Skeleton className="h-[100px] w-full" />
    </div>
  );
}

export function StatsTabSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-[300px] w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-[120px]" />
        <Skeleton className="h-[120px]" />
        <Skeleton className="h-[120px]" />
        <Skeleton className="h-[120px]" />
      </div>
    </div>
  );
}

/**
 * Lazy load Recharts components
 * Recharts est lourd, on le charge seulement quand nécessaire
 */
export const LazyRadarChart = dynamic(
  () => import('recharts').then((mod) => mod.RadarChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
);

export const LazyAreaChart = dynamic(
  () => import('recharts').then((mod) => mod.AreaChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
);

export const LazyLineChart = dynamic(
  () => import('recharts').then((mod) => mod.LineChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
);

export const LazyBarChart = dynamic(
  () => import('recharts').then((mod) => mod.BarChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
);

export const LazyPieChart = dynamic(
  () => import('recharts').then((mod) => mod.PieChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  }
);

/**
 * Lazy load heavy analysis components
 * Ces composants contiennent des calculs lourds et des graphiques
 */

// Note: Ces exports sont préparés pour l'avenir
// Décommentez quand les composants existent

// export const LazyAnalysisTab = dynamic(
//   () => import('@/presentation/components/ui/legacy/match-detail/analysis-tab').then(mod => ({ default: mod.AnalysisTab })),
//   {
//     loading: () => <AnalysisTabSkeleton />,
//     ssr: false,
//   }
// );

// export const LazyH2HTab = dynamic(
//   () => import('@/presentation/components/ui/legacy/match-detail/h2h-tab').then(mod => ({ default: mod.H2HTab })),
//   {
//     loading: () => <H2HTabSkeleton />,
//     ssr: false,
//   }
// );

// export const LazyStatsTab = dynamic(
//   () => import('@/presentation/components/ui/legacy/match-detail/stats-tab').then(mod => ({ default: mod.StatsTab })),
//   {
//     loading: () => <StatsTabSkeleton />,
//     ssr: false,
//   }
// );

/**
 * Lazy load other heavy components
 */
export const LazyConfetti = dynamic(
  () => import('react-confetti').then((mod) => ({ default: mod.default })),
  {
    ssr: false,
  }
);
