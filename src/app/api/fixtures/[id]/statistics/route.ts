
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Mock data for statistics
    const stats = [
        { type: "Possession", value: { home: "55%", away: "45%" } },
        { type: "Tirs", value: { home: 12, away: 8 } },
        { type: "Tirs cadrés", value: { home: 5, away: 3 } },
        { type: "Corners", value: { home: 6, away: 4 } },
        { type: "Fautes", value: { home: 10, away: 12 } },
        { type: "Cartons jaunes", value: { home: 1, away: 2 } },
        { type: "Cartons rouges", value: { home: 0, away: 0 } },
        { type: "Passes", value: { home: 450, away: 380 } },
        { type: "Précision des passes", value: { home: "85%", away: "80%" } },
    ];

    return NextResponse.json(stats);
}
