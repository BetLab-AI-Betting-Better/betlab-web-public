
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    // Mock data for H2H
    // Usage: /api/fixtures/headtohead?h2h=HOME_ID-AWAY_ID
    const h2h = [
        {
            id: "mock-h2h-1",
            kickoffTime: "2024-05-15T20:00:00Z",
            homeTeam: { id: 101, name: "Home Team", logo: "" },
            awayTeam: { id: 102, name: "Away Team", logo: "" },
            score: { home: 2, away: 1 },
            league: { id: 1, name: "Premier League", country: "England", logo: "" },
        },
        {
            id: "mock-h2h-2",
            kickoffTime: "2023-12-10T19:45:00Z",
            homeTeam: { id: 102, name: "Away Team", logo: "" },
            awayTeam: { id: 101, name: "Home Team", logo: "" },
            score: { home: 1, away: 1 },
            league: { id: 1, name: "Premier League", country: "England", logo: "" },
        },
        {
            id: "mock-h2h-3",
            kickoffTime: "2023-04-22T15:00:00Z",
            homeTeam: { id: 101, name: "Home Team", logo: "" },
            awayTeam: { id: 102, name: "Away Team", logo: "" },
            score: { home: 0, away: 1 },
            league: { id: 1, name: "Premier League", country: "England", logo: "" },
        },
        {
            id: "mock-h2h-4",
            kickoffTime: "2022-11-05T20:00:00Z",
            homeTeam: { id: 102, name: "Away Team", logo: "" },
            awayTeam: { id: 101, name: "Home Team", logo: "" },
            score: { home: 2, away: 2 },
            league: { id: 1, name: "Premier League", country: "England", logo: "" },
        },
        {
            id: "mock-h2h-5",
            kickoffTime: "2022-03-12T16:00:00Z",
            homeTeam: { id: 101, name: "Home Team", logo: "" },
            awayTeam: { id: 102, name: "Away Team", logo: "" },
            score: { home: 3, away: 0 },
            league: { id: 1, name: "Premier League", country: "England", logo: "" },
        },
    ];

    return NextResponse.json(h2h);
}
