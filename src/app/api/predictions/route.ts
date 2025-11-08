/**
 * Predictions API Route Handler
 *
 * POST /api/predictions
 * Body: { fixtureIds: number[], type: PredictionType }
 *
 * Returns predictions for the specified fixtures.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getPredictions,
  type PredictionType,
} from "@/modules/predictions/server/queries";

// ⚠️ runtime = "nodejs" removed - incompatible with cacheComponents in Next.js 16

interface PredictionsRequest {
  fixtureIds: number[];
  type?: PredictionType;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: PredictionsRequest = await request.json();

    // Validate request
    if (!body.fixtureIds || !Array.isArray(body.fixtureIds)) {
      return NextResponse.json({ error: "fixtureIds array is required" }, { status: 400 });
    }

    if (body.fixtureIds.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Validate fixtureIds are numbers
    if (!body.fixtureIds.every((id) => typeof id === "number")) {
      return NextResponse.json({ error: "All fixtureIds must be numbers" }, { status: 400 });
    }

    const type = body.type || "match_result";

    // Call server service
    const predictions = await getPredictions(body.fixtureIds, type);

    // Return predictions with appropriate caching headers
    return NextResponse.json(predictions, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch (error) {
    console.error("Error in POST /api/predictions:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch predictions",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
