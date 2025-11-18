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

const PREFETCH_LIMIT = 8;
const FALLBACK_PREFETCH_IDS = ["1390931"];

export async function generateStaticParams() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const fixturesService = container.createFixturesService();
    const matches = await fixturesService.getFixturesByDate(today);
    const params = matches
      .slice(0, PREFETCH_LIMIT)
      .map((match) => ({ id: match.fixtureId.toString() }));

    if (params.length > 0) {
      return params;
    }
  } catch (error) {
    console.warn("generateStaticParams(match/[id]) failed, using fallback IDs:", error);
  }

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
