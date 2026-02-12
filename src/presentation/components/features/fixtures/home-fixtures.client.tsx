/**
 * Homepage Client Component — Premium Design v4.0
 *
 * Reorganized layout:
 * 1. Calendar strip (date selection)
 * 2. Unified toolbar card (search + leagues + predictions + filters)
 * 3. Results summary bar
 * 4. Match grid (responsive columns)
 */

"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Check, Radio, Search, SlidersHorizontal, X } from "lucide-react";

import {
  CalendarWidget,
  LeaguesSelector,
  PredictionsSelector,
  FiltersPanel,
  MatchList,
  TeamChoiceSection,
} from "@/presentation/components/features/fixtures";
import { useFixtureFilters } from "@/presentation/hooks/fixtures/use-fixture-filters";
import { useLiveScores } from "@/presentation/hooks/fixtures/use-live-scores";
import { buildMatchCardVM } from "@/application/view-models/fixtures/match-card.vm";
import type { MatchWithPrediction } from "@/core/entities/fixtures/fixture.entity";
import { cn } from "@/shared/utils";

interface HomeFixturesClientProps {
  initialMatches: MatchWithPrediction[];
}

export function HomeFixturesClient({ initialMatches }: HomeFixturesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

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

  const handleMatchClick = (matchId: string) => {
    router.push(`/match/${matchId}`);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    const dateStr = format(date, "yyyy-MM-dd");
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", dateStr);
    router.push(`/?${params.toString()}`);
  };

  // Live scores polling — merges live data into filtered matches
  const { matches: liveMatches, isLive } = useLiveScores(filteredMatches);

  const hasActiveFilters = selectedConfidences.length > 0 || minProbability > 0 || xGRange[0] > 0 || xGRange[1] < 5;
  const activeFilterCount = selectedConfidences.length + (minProbability > 0 ? 1 : 0) + (xGRange[0] > 0 || xGRange[1] < 5 ? 1 : 0);


  // Prediction performance stats for finished matches
  const matchVMs = useMemo(() => liveMatches.map(buildMatchCardVM), [liveMatches]);

  const predictionStats = useMemo(() => {
    let total1x2 = 0;
    let correct1x2 = 0;
    let totalProno = 0;
    let correctProno = 0;

    for (const match of matchVMs) {
      if (match.status !== "finished" || !match.validation) continue;

      if (match.validation.matchResultOutcome !== null) {
        total1x2++;
        if (
          match.validation.matchResultOutcome === "correct" ||
          match.validation.matchResultOutcome === "half-win" ||
          match.validation.matchResultOutcome === "void"
        ) {
          correct1x2++;
        }
      }

      if (match.bestMarket && match.validation.bestMarketOutcome !== null) {
        totalProno++;
        if (
          match.validation.bestMarketOutcome === "correct" ||
          match.validation.bestMarketOutcome === "half-win" ||
          match.validation.bestMarketOutcome === "void"
        ) {
          correctProno++;
        }
      }
    }

    return { total1x2, correct1x2, totalProno, correctProno };
  }, [matchVMs]);

  return (
    <div className="space-y-4">
      {/* ── 1. Calendar ────────────────────────────── */}
      <CalendarWidget
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        matchCountsByDate={matchCountsByDate}
      />

      {/* ── 1.5. Team's Choice ──────────────────────── */}
      <TeamChoiceSection matches={matchVMs} />

      {/* ── 2. Unified toolbar ─────────────────────── */}
      <div className="bg-surface-elevated rounded-xl border border-gray-200/60 shadow-sm">
        {/* Row 1: Search + Filter toggle */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100/80">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher equipe ou ligue..."
              className={cn(
                "w-full h-9 pl-9 pr-8 rounded-lg",
                "bg-gray-50/80 border-none",
                "text-[13px] text-text-primary placeholder:text-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-navy/10 focus:bg-white",
                "transition-all duration-200"
              )}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-gray-400 hover:text-navy transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "relative flex items-center gap-1.5 px-3 h-9 rounded-lg text-[12px] font-medium transition-all duration-200 shrink-0",
              showFilters || hasActiveFilters
                ? "bg-navy text-white"
                : "bg-gray-50/80 text-gray-500 hover:text-navy hover:bg-gray-100"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filtres</span>
            {hasActiveFilters && (
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-lime text-navy-950 text-[9px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Row 2: Leagues pills */}
        <div className="px-3 py-2 border-b border-gray-100/80">
          <LeaguesSelector
            leagues={leagues}
            selectedLeagueId={selectedLeagueId}
            onLeagueChange={(id) => setSelectedLeagueId(id)}
          />
        </div>

        {/* Row 3: Prediction type pills */}
        <div className="px-3 py-2">
          <PredictionsSelector
            selectedType={selectedPredictionType}
            onTypeChange={(type) => setSelectedPredictionType(type)}
          />
        </div>

        {/* Collapsible advanced filters */}
        {showFilters && (
          <div className="px-3 pb-3 pt-1 border-t border-gray-100/80">
            <FiltersPanel
              selectedConfidences={selectedConfidences}
              onConfidencesChange={setSelectedConfidences}
              xGRange={xGRange}
              onXGRangeChange={setXGRange}
              minProbability={minProbability}
              onMinProbabilityChange={setMinProbability}
            />
          </div>
        )}
      </div>

      {/* ── 3. Results summary + performance stats ── */}
      <div className="flex items-center justify-between px-1 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-text-primary tabular-nums">
            {liveMatches.length}
          </span>
          <span className="text-[13px] text-gray-500">
            match{liveMatches.length !== 1 ? "s" : ""}
          </span>
          {isLive && (
            <>
              <span className="text-[11px] text-gray-300">|</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-error/10 text-error text-[10px] font-semibold animate-pulse">
                <Radio className="w-2.5 h-2.5" />
                Live
              </span>
            </>
          )}
          <span className="text-[11px] text-gray-300">|</span>
          <span className="text-[11px] text-gray-400 tabular-nums">
            {format(selectedDate, "dd/MM/yyyy")}
          </span>
        </div>

        {/* Performance chips */}
        {(predictionStats.total1x2 > 0 || predictionStats.totalProno > 0) && (
          <div className="flex items-center gap-2">
            {predictionStats.total1x2 > 0 && (
              <div className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold",
                predictionStats.correct1x2 / predictionStats.total1x2 >= 0.5
                  ? "bg-success/10 text-success"
                  : "bg-error/10 text-error"
              )}>
                <Check className="w-3 h-3" strokeWidth={3} />
                <span className="tabular-nums">{predictionStats.correct1x2}/{predictionStats.total1x2}</span>
                <span className="font-medium opacity-70">1X2</span>
              </div>
            )}
            {predictionStats.totalProno > 0 && (
              <div className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold",
                predictionStats.correctProno / predictionStats.totalProno >= 0.5
                  ? "bg-success/10 text-success"
                  : "bg-error/10 text-error"
              )}>
                <Check className="w-3 h-3" strokeWidth={3} />
                <span className="tabular-nums">{predictionStats.correctProno}/{predictionStats.totalProno}</span>
                <span className="font-medium opacity-70">Prono</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 4. Match grid ──────────────────────────── */}
      <MatchList
        matches={matchVMs}
        onMatchClick={handleMatchClick}
      />
    </div>
  );
}
