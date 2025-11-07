"use client"

import { useState, useMemo } from "react"
import { useSportStore } from "@/lib/stores/sport-store"
import type { PredictionType, ConfidenceLevel } from "@/lib/components/home"
import type { Match } from "./use-fixtures"

// Popular league IDs (same as Flutter app)
const POPULAR_LEAGUE_IDS = new Set([
  39,  // Premier League
  140, // La Liga
  61,  // Ligue 1
  78,  // Bundesliga
  135, // Serie A
  2,   // UEFA Champions League
  3,   // UEFA Europa League
  848, // UEFA Conference League
  94,  // Primeira Liga
  88,  // Eredivisie
  203, // Super Lig
  71,  // Serie A Brazil
  128, // Liga MX
  253, // MLS
])

// Clean league name by removing group/girone suffixes
function cleanLeagueName(name: string): string {
  return name
    .replace(/\s*-\s*(Group|Groupe|Grupo|Girone|Groep)\s+[A-Z0-9]+\s*$/i, '')
    .replace(/\s*-\s*(Phase|Stage|Round)\s+\d+\s*$/i, '')
    .replace(/\s*-\s*League\s+Stage\s*-\s*\d+\s*$/i, '')
    .trim()
}

export function useHomeFilters(matches: Match[]) {
  const { activeSport, setActiveSport } = useSportStore()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | "all" | "favorites">("favorites")
  const [selectedPredictionType, setSelectedPredictionType] = useState<PredictionType>("internal")
  const [selectedConfidences, setSelectedConfidences] = useState<ConfidenceLevel[]>([])
  const [xGRange, setXGRange] = useState<[number, number]>([0, 5])
  const [minProbability, setMinProbability] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  // Extraction ligues depuis matchs (groupées par nom nettoyé)
  const leagues = useMemo(() => {
    const leagueMap = new Map<string, { id: string; name: string; logo: string; matchCount: number; isPopular: boolean }>()

    matches.forEach((match) => {
      const cleanedName = cleanLeagueName(match.league.name)
      const existing = leagueMap.get(cleanedName)

      if (existing) {
        existing.matchCount++
      } else {
        leagueMap.set(cleanedName, {
          id: `${match.league.id}`,
          name: cleanedName,
          logo: match.league.logo,
          matchCount: 1,
          isPopular: POPULAR_LEAGUE_IDS.has(match.league.id),
        })
      }
    })

    return Array.from(leagueMap.values()).sort((a, b) => b.matchCount - a.matchCount)
  }, [matches])

  // Filtrage des matchs
  const filteredMatches = useMemo(() => {
    let filtered = [...matches]

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(m =>
        m.homeTeam.name.toLowerCase().includes(query) ||
        m.awayTeam.name.toLowerCase().includes(query) ||
        m.league.name.toLowerCase().includes(query) ||
        cleanLeagueName(m.league.name).toLowerCase().includes(query)
      )
    }

    // Filtre par ligue
    if (selectedLeagueId === "favorites") {
      // Afficher uniquement les leagues populaires
      filtered = filtered.filter(m => POPULAR_LEAGUE_IDS.has(m.league.id))
    } else if (selectedLeagueId !== "all") {
      // Afficher une league spécifique (par nom nettoyé pour regrouper les variantes)
      const selectedLeague = leagues.find(l => l.id === selectedLeagueId)
      if (selectedLeague) {
        const cleanedSelectedName = selectedLeague.name
        filtered = filtered.filter(m => cleanLeagueName(m.league.name) === cleanedSelectedName)
      }
    }

    return filtered
  }, [matches, selectedLeagueId, leagues, searchQuery])

  // Compteur matchs par date (pour CalendarWidget)
  const matchCountsByDate = useMemo(() => {
    const counts = new Map<string, number>()
    // TODO: Compter matchs par date (besoin de plusieurs dates de l'API)
    return counts
  }, [matches])

  return {
    // State
    selectedDate,
    activeSport,
    selectedLeagueId,
    selectedPredictionType,
    selectedConfidences,
    xGRange,
    minProbability,
    searchQuery,

    // Setters
    setSelectedDate,
    setActiveSport,
    setSelectedLeagueId,
    setSelectedPredictionType,
    setSelectedConfidences,
    setXGRange,
    setMinProbability,
    setSearchQuery,

    // Computed
    leagues,
    filteredMatches,
    matchCountsByDate,
  }
}
