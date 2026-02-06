/**
 * Homepage - Server Component
 *
 * Next.js 16 Server Component for the homepage.
 * Data is fetched server-side using the new server/services layer.
 *
 * Features:
 * - Server-side data fetching with cache()
 * - Streaming with Suspense
 * - Partial Pre-Rendering (PPR) enabled
 * - Minimal client JS (only for UI interactions)
 */

import { Suspense } from "react";
import { LoadingState } from "@/presentation/components/ui/loading-state";
import { HomeFixturesSection } from "@/presentation/components/features/fixtures/home-fixtures-section";

// ✅ PPR is enabled globally via cacheComponents: true in next.config.ts
// No need for page-level experimental_ppr

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage(props: PageProps) {
  const searchParams = await props.searchParams;
  const dateParam = searchParams.date;
  const asOf = typeof dateParam === "string" ? new Date(dateParam) : new Date();

  return (
    <div className="px-4 py-5 lg:px-6">
      <Suspense fallback={<LoadingState />}>
        {/* Force re-render key when date changes to ensure Suspense triggers */}
        <HomeFixturesSection
          key={asOf.toISOString()}
          asOf={asOf}
        />
      </Suspense>
    </div>
  );
}
