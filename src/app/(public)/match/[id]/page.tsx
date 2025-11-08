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
import { getMatchDetail } from "@/modules/match-detail";
import { MatchDetailClient } from "./page.client";
import { LoadingSkeleton, ErrorState } from "./page.components";

interface MatchDetailPageProps {
  params: Promise<{ id: string }>;
}

async function MatchDetailContent({ id }: { id: string }) {
  let match: Awaited<ReturnType<typeof getMatchDetail>>;

  try {
    match = await getMatchDetail(id);
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
