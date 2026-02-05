/**
 * Homepage Client Component
 *
 * Handles client-side UI interactions (filtering, search, navigation).
 * Receives server-fetched data as props.
 *
 * This separation allows:
 * - Server Component for data fetching (SEO, performance)
 * - Client Component for interactivity (filters, favorites)
 */

"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
 
import {
  CalendarWidget,
  SearchBar,
  SportSelector,
  LeaguesSelector,
  PredictionsSelector,
  FiltersPanel,
  MatchList,
} from "@/presentation/components/features/fixtures";
import { useFixtureFilters } from "@/presentation/hooks/fixtures/use-fixture-filters";
import type { MatchWithPrediction } from "@/core/entities/fixtures/fixture.entity";

interface HomeFixturesClientProps {
  initialMatches: MatchWithPrediction[];
}

export function HomeFixturesClient({ initialMatches }: HomeFixturesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize date from URL or default to today
  const dateParam = searchParams.get("date");
  const initialDate = useMemo(() => {
    return dateParam ? new Date(dateParam) : new Date();
  }, [dateParam]);

  const normalizedMatches = useMemo<MatchWithPrediction[]>(() => {
    return initialMatches.map((match) => {
      const kickoffSource = match.kickoffTime;
      if (typeof kickoffSource === "string" || typeof kickoffSource === "number") {
        const parsedDate = new Date(kickoffSource);
        return {
          ...match,
          kickoffTime: Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
        };
      }
      return match;
    });
  }, [initialMatches]);

  // Client-side filtering (no fetch, just local state)
  const {
    selectedDate,
    selectedLeagueId,
    selectedPredictionType,
    selectedConfidences,
    xGRange,
    minProbability,
    searchQuery,
    setSelectedDate,
    setSelectedLeagueId,
    setSelectedPredictionType,
    setSelectedConfidences,
    setXGRange,
    setMinProbability,
    setSearchQuery,
    leagues,
    filteredMatches,
    matchCountsByDate,
  } = useFixtureFilters(normalizedMatches, initialDate);

  // TODO: Fetch favorites server-side and pass as props
  const matchesWithState = filteredMatches;

  // Handlers
  const handleMatchClick = (matchId: string) => {
    router.push(`/match/${matchId}`);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    // Update URL to trigger server-side fetch
    const dateStr = format(date, "yyyy-MM-dd");
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", dateStr);
    router.push(`/?${params.toString()}`);
  };

  return (
    <>
      {/* Filters & Search */}
      <div className="space-y-4">
        <CalendarWidget
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          matchCountsByDate={matchCountsByDate}
        />

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Rechercher une équipe ou une ligue..."
        />

        <SportSelector />

        <LeaguesSelector
          leagues={leagues}
          selectedLeagueId={selectedLeagueId}
          onLeagueChange={(id) => setSelectedLeagueId(id)}
        />

        <PredictionsSelector
          selectedType={selectedPredictionType}
          onTypeChange={(type) => setSelectedPredictionType(type)}
        />

        <FiltersPanel
          selectedConfidences={selectedConfidences}
          onConfidencesChange={setSelectedConfidences}
          xGRange={xGRange}
          onXGRangeChange={setXGRange}
          minProbability={minProbability}
          onMinProbabilityChange={setMinProbability}
        />
      </div>

      {/* Matches List */}
      <MatchList
        matches={matchesWithState}
        onMatchClick={handleMatchClick}
      />

    </>
  );
}
