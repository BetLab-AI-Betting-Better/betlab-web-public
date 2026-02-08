
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Mock data for lineups
    const lineups = [
        {
            team: { id: 1, name: "Home Team", logo: "" },
            formation: "4-3-3",
            coach: { id: 101, name: "Home Coach", photo: "" },
            startXI: [
                { id: 1, name: "Goalkeeper H", number: 1, pos: "G", grid: "1:1" },
                { id: 2, name: "Defender H1", number: 2, pos: "D", grid: "2:1" },
                { id: 3, name: "Defender H2", number: 3, pos: "D", grid: "2:2" },
                { id: 4, name: "Defender H3", number: 4, pos: "D", grid: "2:3" },
                { id: 5, name: "Defender H4", number: 5, pos: "D", grid: "2:4" },
                { id: 6, name: "Midfielder H1", number: 6, pos: "M", grid: "3:1" },
                { id: 7, name: "Midfielder H2", number: 8, pos: "M", grid: "3:2" },
                { id: 8, name: "Midfielder H3", number: 10, pos: "M", grid: "3:3" },
                { id: 9, name: "Forward H1", number: 7, pos: "F", grid: "4:1" },
                { id: 10, name: "Forward H2", number: 9, pos: "F", grid: "4:2" },
                { id: 11, name: "Forward H3", number: 11, pos: "F", grid: "4:3" },
            ],
            substitutes: [
                { id: 12, name: "Sub H1", number: 12, pos: "G", grid: null },
                { id: 13, name: "Sub H2", number: 13, pos: "D", grid: null },
                { id: 14, name: "Sub H3", number: 14, pos: "M", grid: null },
                { id: 15, name: "Sub H4", number: 15, pos: "F", grid: null },
            ],
        },
        {
            team: { id: 2, name: "Away Team", logo: "" },
            formation: "4-4-2",
            coach: { id: 102, name: "Away Coach", photo: "" },
            startXI: [
                { id: 21, name: "Goalkeeper A", number: 1, pos: "G", grid: "1:1" },
                { id: 22, name: "Defender A1", number: 2, pos: "D", grid: "2:1" },
                { id: 23, name: "Defender A2", number: 3, pos: "D", grid: "2:2" },
                { id: 24, name: "Defender A3", number: 4, pos: "D", grid: "2:3" },
                { id: 25, name: "Defender A4", number: 5, pos: "D", grid: "2:4" },
                { id: 26, name: "Midfielder A1", number: 6, pos: "M", grid: "3:1" },
                { id: 27, name: "Midfielder A2", number: 8, pos: "M", grid: "3:2" },
                { id: 28, name: "Midfielder A3", number: 10, pos: "M", grid: "3:3" },
                { id: 29, name: "Midfielder A4", number: 11, pos: "M", grid: "3:4" },
                { id: 30, name: "Forward A1", number: 7, pos: "F", grid: "4:1" },
                { id: 31, name: "Forward A2", number: 9, pos: "F", grid: "4:2" },
            ],
            substitutes: [
                { id: 32, name: "Sub A1", number: 12, pos: "G", grid: null },
                { id: 33, name: "Sub A2", number: 13, pos: "D", grid: null },
                { id: 34, name: "Sub A3", number: 14, pos: "M", grid: null },
                { id: 35, name: "Sub A4", number: 15, pos: "F", grid: null },
            ],
        },
    ];

    return NextResponse.json(lineups);
}
