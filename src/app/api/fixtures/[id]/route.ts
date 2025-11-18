/**
 * Fixture Detail API Route Handler
 *
 * GET /api/fixtures/[id]
 *
 * Returns detailed information for a specific fixture.
 */

import { NextRequest, NextResponse } from "next/server";
import { container } from "@/presentation/di/container";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {

    // Validate ID
    if (!id || isNaN(parseInt(id, 10))) {
      return NextResponse.json({ error: "Invalid fixture ID" }, { status: 400 });
    }

    const matchDetailRepository = container.createMatchDetailRepository();
    const match = await matchDetailRepository.getMatchDetail(id);

    // Return match detail with appropriate caching headers
    return NextResponse.json(match, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error(`Error in GET /api/fixtures/${id}:`, error);
    return NextResponse.json(
      {
        error: "Failed to fetch fixture detail",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
