/**
 * Fixtures API Route Handler
 *
 * GET /api/fixtures?date=YYYY-MM-DD
 *
 * This Route Handler provides a client-accessible API endpoint
 * that wraps the server service layer.
 *
 * Use cases:
 * - Client-side polling for live scores
 * - Legacy components not yet migrated to Server Components
 * - Progressive enhancement
 */

import { NextRequest, NextResponse, connection } from "next/server";
import { getFixtures } from "@/modules/fixtures/server/queries";

// ⚠️ runtime = "nodejs" removed - incompatible with cacheComponents in Next.js 16

export async function GET(request: NextRequest) {
  try {
    await connection(); // Ensure this route is treated as dynamic when search params are used

    // Extract date from query params
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    // Validate date format (basic check)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD" }, { status: 400 });
    }

    // Call server service
    const fixtures = await getFixtures(date);

    // Return fixtures with appropriate caching headers
    return NextResponse.json(fixtures, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/fixtures:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch fixtures",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
