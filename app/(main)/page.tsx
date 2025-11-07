"use client"

import { useRouter } from "next/navigation"
import { CalendarWidget, SearchBar, SportSelector, LeaguesSelector, PredictionsSelector, FiltersPanel } from "@/lib/components/home"
import { MatchList } from "@/lib/components/home"
import { LoadingState } from "@/lib/components/ui/loading-state"
import { ErrorState } from "@/lib/components/ui/error-state"
import { useFixtures } from "@/lib/hooks/use-fixtures"
import { usePredictions } from "@/lib/hooks/use-predictions"
import { useHomeFilters } from "@/lib/hooks/use-home-filters"
import { useFavoritesStore } from "@/lib/stores/favorites-store"

export default function HomePage() {
  const router = useRouter()

  // Fetch fixtures
  const { data: matches = [], isLoading, isError, refetch } = useFixtures({
    date: new Date(),
  })

  // Filters state
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
  } = useHomeFilters(matches)

  // Fetch predictions pour matchs filtrés
  const fixtureIds = filteredMatches.map(m => m.fixtureId)
  const { data: predictions = [] } = usePredictions({
    fixtureIds,
    type: selectedPredictionType,
    enabled: fixtureIds.length > 0,
  })

  // Favorites
  const { toggleFavorite, isFavorite } = useFavoritesStore()

  // Merge predictions avec matchs
  const matchesWithPredictions = filteredMatches.map(match => ({
    ...match,
    prediction: predictions.find(p => p.fixtureId === match.fixtureId),
    isFavorite: isFavorite(match.id),
  }))

  // Handlers
  const handleMatchClick = (matchId: string) => {
    router.push(`/match/${matchId}`)
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <ErrorState
          title="Erreur de chargement"
          message="Impossible de charger les matchs"
          onRetry={refetch}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      {/* Sélecteurs */}
      <div className="space-y-4">
        <CalendarWidget
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
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
          onLeagueChange={setSelectedLeagueId}
        />

        <PredictionsSelector
          selectedType={selectedPredictionType}
          onTypeChange={setSelectedPredictionType}
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

      {/* Matchs */}
      {isLoading ? (
        <LoadingState />
      ) : (
        <MatchList
          matches={matchesWithPredictions}
          onMatchClick={handleMatchClick}
          onFavoriteToggle={toggleFavorite}
        />
      )}
    </div>
  )
}
