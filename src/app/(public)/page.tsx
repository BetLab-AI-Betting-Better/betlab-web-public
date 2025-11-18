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

export default function HomePage() {
  return (
    <div className="container mx-auto space-y-6 p-4">
      <Suspense fallback={<LoadingState />}>
        <HomeFixturesSection />
      </Suspense>
    </div>
  );
}
