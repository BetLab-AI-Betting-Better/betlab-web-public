/**
 * Match Detail Page - Server Component
 *
 * Next.js 16 Server Component for match detail page.
 * Data is fetched server-side for better SEO and performance.
 *
 * Features:
 * - Server-side data fetching with cache()
 * - Dynamic params with typed props
 * - Streaming with Suspense
 * - Minimal client JS (only for tabs/UI)
 */

import { Suspense } from "react";
import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity";
import { container } from "@/presentation/di/container";
import { MatchDetailClient } from "./page.client";
import { LoadingSkeleton, ErrorState } from "./page.components";

interface MatchDetailPageProps {
  params: Promise<{ id: string }>;
}

const FALLBACK_PREFETCH_IDS = ["1390931"];

// Simplified generateStaticParams - returns fallback ID only to satisfy cacheComponents requirement
// Full static generation disabled to avoid build-time API dependency
export async function generateStaticParams() {
  // Return minimal fallback to satisfy Next.js 16 cacheComponents requirement
  // Actual pages will be generated on-demand at runtime
  return FALLBACK_PREFETCH_IDS.map((id) => ({ id }));
}

async function MatchDetailContent({ id }: { id: string }) {
  let match: MatchDetail;
  const matchDetailRepository = container.createMatchDetailRepository();

  try {
    match = await matchDetailRepository.getMatchDetail(id);
  } catch (error) {
    return (
      <ErrorState
        message={(error as Error)?.message || "Impossible de charger les détails du match"}
      />
    );
  }

  return <MatchDetailClient match={match} />;
}

export default async function MatchDetailPage({ params }: MatchDetailPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <MatchDetailContent id={id} />
    </Suspense>
  );
}
