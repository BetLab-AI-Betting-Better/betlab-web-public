# Guide d'intégration rapide - BetLab Cards

Guide pour intégrer rapidement les composants Cards dans l'application BetLab.

---

## 1. Installation (déjà fait)

Tous les composants sont créés et prêts. Vérifiez que vous avez bien:
- ✅ `lib/components/cards/` (5 fichiers .tsx + 1 .ts)
- ✅ `lib/components/common/` (3 fichiers .tsx + 1 .ts)
- ✅ `lib/components/examples/cards-example.tsx`

---

## 2. Imports

### Import groupé
```typescript
// Tous les composants cards
import {
  MatchCard,
  MatchCardCompact,
  MatchCardSkeleton,
  Over15Card,
  BTTSCard,
  ExactScoreCard,
  HTFTCard,
  HalfCompareCard,
  CleanSheetCard,
  CornersCard,
  InternalProbabilitiesCard,
  type MatchCardProps,
  type PredictionCardProps
} from "@/presentation/components/ui/legacy/cards"

// Composants communs
import {
  ConfidenceBadge,
  EdgeChip,
  LiveBadge,
  type ConfidenceLevel
} from "@/presentation/components/ui/legacy/common"
```

### Import individuel
```typescript
import { MatchCard } from "@/presentation/components/ui/legacy/cards/match-card"
import { Over15Card } from "@/presentation/components/ui/legacy/cards/prediction-variants"
import { ConfidenceBadge } from "@/presentation/components/ui/legacy/common/confidence-badge"
```

---

## 3. Page: Liste des matchs

**Fichier:** `app/matches/page.tsx`

```typescript
"use client"

import { MatchCard, MatchCardSkeleton } from "@/presentation/components/ui/legacy/cards"
import { useState, useEffect } from "react"

export default function MatchesPage() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  useEffect(() => {
    // Fetch matches from API
    fetchMatches().then(data => {
      setMatches(data)
      setLoading(false)
    })
  }, [])

  const toggleFavorite = (matchId: number) => {
    setFavorites(prev => {
      const newSet = new Set(prev)
      if (newSet.has(matchId)) {
        newSet.delete(matchId)
      } else {
        newSet.add(matchId)
      }
      return newSet
    })
  }

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <MatchCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          prediction={match.prediction}
          isFavorite={favorites.has(match.id)}
          onToggleFavorite={() => toggleFavorite(match.id)}
          onClick={() => router.push(`/matches/${match.id}`)}
        />
      ))}
    </div>
  )
}
```

---

## 4. Page: Détails d'un match

**Fichier:** `app/matches/[id]/page.tsx`

```typescript
"use client"

import {
  Over15Card,
  BTTSCard,
  ExactScoreCard,
  HTFTCard,
  HalfCompareCard,
  CleanSheetCard,
  CornersCard,
  InternalProbabilitiesCard
} from "@/presentation/components/ui/legacy/cards"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/presentation/components/ui/tabs"

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const [match, setMatch] = useState(null)
  const [predictions, setPredictions] = useState(null)

  useEffect(() => {
    // Fetch match and predictions
    fetchMatchDetail(params.id).then(data => {
      setMatch(data.match)
      setPredictions(data.predictions)
    })
  }, [params.id])

  if (!predictions) return <div>Loading...</div>

  return (
    <div className="space-y-6 p-4">
      {/* Match header */}
      <MatchCard match={match} />

      {/* Predictions tabs */}
      <Tabs defaultValue="over15">
        <TabsList className="w-full">
          <TabsTrigger value="over15">Over/Under</TabsTrigger>
          <TabsTrigger value="btts">BTTS</TabsTrigger>
          <TabsTrigger value="score">Score</TabsTrigger>
        </TabsList>

        <TabsContent value="over15" className="mt-6">
          <Over15Card
            confidence={predictions.over15.confidence}
            edge={predictions.over15.edge}
            value={predictions.over15.value}
            overProbability={predictions.over15.overProb}
            underProbability={predictions.over15.underProb}
            averageGoals={predictions.over15.avgGoals}
            lastMatches={predictions.over15.history}
            updatedAt={new Date(predictions.over15.updatedAt)}
          />
        </TabsContent>

        <TabsContent value="btts" className="mt-6">
          <BTTSCard
            confidence={predictions.btts.confidence}
            edge={predictions.btts.edge}
            value={predictions.btts.value}
            bttsYesProbability={predictions.btts.yesProb}
            bttsNoProbability={predictions.btts.noProb}
            homeGoalsAvg={predictions.btts.homeAvg}
            awayGoalsAvg={predictions.btts.awayAvg}
            updatedAt={new Date(predictions.btts.updatedAt)}
          />
        </TabsContent>

        <TabsContent value="score" className="mt-6">
          <ExactScoreCard
            confidence={predictions.exactScore.confidence}
            edge={predictions.exactScore.edge}
            value={predictions.exactScore.value}
            topScores={predictions.exactScore.topScores}
            updatedAt={new Date(predictions.exactScore.updatedAt)}
          />
        </TabsContent>
      </Tabs>

      {/* All predictions grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <HTFTCard {...predictions.htft} />
        <HalfCompareCard {...predictions.halfCompare} />
        <CleanSheetCard {...predictions.cleanSheet} />
        <CornersCard {...predictions.corners} />
      </div>

      {/* Internal probabilities (full width) */}
      <InternalProbabilitiesCard
        {...predictions.internal}
        gradient
      />
    </div>
  )
}
```

---

## 5. Component: Match List avec filtres

**Fichier:** `components/features/match-list.tsx`

```typescript
"use client"

import { MatchCard, MatchCardSkeleton } from "@/presentation/components/ui/legacy/cards"
import { useState } from "react"

interface MatchListProps {
  initialMatches?: any[]
  loading?: boolean
  onMatchClick?: (matchId: number) => void
}

export function MatchList({
  initialMatches = [],
  loading = false,
  onMatchClick
}: MatchListProps) {
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming'>('all')
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  const filteredMatches = initialMatches.filter(match => {
    if (filter === 'all') return true
    if (filter === 'live') return match.status === 'live'
    if (filter === 'upcoming') return match.status === 'scheduled'
    return true
  })

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <MatchCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'active' : ''}
        >
          Tous
        </button>
        <button
          onClick={() => setFilter('live')}
          className={filter === 'live' ? 'active' : ''}
        >
          Live
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={filter === 'upcoming' ? 'active' : ''}
        >
          À venir
        </button>
      </div>

      {/* Matches */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="text-center text-muted-foreground">
            Aucun match trouvé
          </div>
        ) : (
          filteredMatches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              prediction={match.prediction}
              isFavorite={favorites.has(match.id)}
              onToggleFavorite={() => {
                setFavorites(prev => {
                  const newSet = new Set(prev)
                  if (newSet.has(match.id)) {
                    newSet.delete(match.id)
                  } else {
                    newSet.add(match.id)
                  }
                  return newSet
                })
              }}
              onClick={() => onMatchClick?.(match.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
```

---

## 6. Hook: useFavorites

**Fichier:** `lib/hooks/use-favorites.ts`

```typescript
"use client"

import { useState, useEffect } from "react"

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('betlab-favorites')
    if (stored) {
      setFavorites(new Set(JSON.parse(stored)))
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('betlab-favorites', JSON.stringify(Array.from(favorites)))
  }, [favorites])

  const toggleFavorite = (matchId: number) => {
    setFavorites(prev => {
      const newSet = new Set(prev)
      if (newSet.has(matchId)) {
        newSet.delete(matchId)
      } else {
        newSet.add(matchId)
      }
      return newSet
    })
  }

  const isFavorite = (matchId: number) => favorites.has(matchId)

  return {
    favorites,
    toggleFavorite,
    isFavorite
  }
}
```

**Usage:**
```typescript
const { favorites, toggleFavorite, isFavorite } = useFavorites()

<MatchCard
  match={match}
  isFavorite={isFavorite(match.id)}
  onToggleFavorite={() => toggleFavorite(match.id)}
/>
```

---

## 7. API Integration

**Fichier:** `lib/api/matches.ts`

```typescript
export interface MatchData {
  id: number
  homeTeam: { name: string; logo: string }
  awayTeam: { name: string; logo: string }
  league: { name: string; logo: string }
  date: string
  status: 'scheduled' | 'live' | 'finished'
  score?: { home: number; away: number }
  prediction?: {
    type: string
    value: string
    confidence: 'high' | 'medium' | 'low'
    edge?: number
  }
}

export async function fetchMatches(): Promise<MatchData[]> {
  const response = await fetch('/api/matches')
  return response.json()
}

export async function fetchMatchDetail(id: string) {
  const response = await fetch(`/api/matches/${id}`)
  return response.json()
}

export async function fetchPredictions(matchId: number) {
  const response = await fetch(`/api/matches/${matchId}/predictions`)
  return response.json()
}
```

---

## 8. Types centralisés

**Fichier:** `lib/types/match.ts`

```typescript
export type MatchStatus = 'scheduled' | 'live' | 'finished'
export type ConfidenceLevel = 'high' | 'medium' | 'low'

export interface Team {
  name: string
  logo: string
}

export interface League {
  name: string
  logo: string
}

export interface Score {
  home: number
  away: number
}

export interface Prediction {
  type: string
  value: string
  confidence: ConfidenceLevel
  edge?: number
}

export interface Match {
  id: number
  homeTeam: Team
  awayTeam: Team
  league: League
  date: string
  status: MatchStatus
  score?: Score
  prediction?: Prediction
}
```

---

## 9. Storybook (optionnel)

**Fichier:** `stories/MatchCard.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { MatchCard } from '@/presentation/components/ui/legacy/cards'

const meta: Meta<typeof MatchCard> = {
  title: 'Cards/MatchCard',
  component: MatchCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MatchCard>

export const Scheduled: Story = {
  args: {
    match: {
      id: 1,
      homeTeam: { name: "PSG", logo: "/logos/psg.png" },
      awayTeam: { name: "OM", logo: "/logos/om.png" },
      league: { name: "Ligue 1", logo: "/logos/l1.png" },
      date: new Date().toISOString(),
      status: "scheduled"
    },
    prediction: {
      type: "Over/Under 1.5",
      value: "Over 1.5",
      confidence: "high",
      edge: 12.5
    }
  }
}

export const Live: Story = {
  args: {
    match: {
      id: 2,
      homeTeam: { name: "PSG", logo: "/logos/psg.png" },
      awayTeam: { name: "OM", logo: "/logos/om.png" },
      league: { name: "Ligue 1", logo: "/logos/l1.png" },
      date: new Date().toISOString(),
      status: "live",
      score: { home: 2, away: 1 }
    }
  }
}
```

---

## 10. Tests (optionnel)

**Fichier:** `__tests__/components/match-card.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { MatchCard } from '@/presentation/components/ui/legacy/cards'

describe('MatchCard', () => {
  const mockMatch = {
    id: 1,
    homeTeam: { name: "PSG", logo: "/logos/psg.png" },
    awayTeam: { name: "OM", logo: "/logos/om.png" },
    league: { name: "Ligue 1", logo: "/logos/l1.png" },
    date: new Date().toISOString(),
    status: "scheduled" as const
  }

  it('renders match information', () => {
    render(<MatchCard match={mockMatch} />)
    expect(screen.getByText('PSG')).toBeInTheDocument()
    expect(screen.getByText('OM')).toBeInTheDocument()
  })

  it('calls onClick when card is clicked', () => {
    const handleClick = jest.fn()
    render(<MatchCard match={mockMatch} onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('toggles favorite', () => {
    const handleToggle = jest.fn()
    render(
      <MatchCard
        match={mockMatch}
        isFavorite={false}
        onToggleFavorite={handleToggle}
      />
    )
    fireEvent.click(screen.getByLabelText('Ajouter aux favoris'))
    expect(handleToggle).toHaveBeenCalled()
  })
})
```

---

## Checklist d'intégration

- [ ] Vérifier que tous les fichiers sont présents
- [ ] Tester l'import des composants
- [ ] Créer une page de démo (ou utiliser cards-example.tsx)
- [ ] Connecter à l'API réelle
- [ ] Tester sur mobile (responsive)
- [ ] Tester le dark mode
- [ ] Implémenter le système de favoris
- [ ] Ajouter la navigation (onClick)
- [ ] Optimiser les images (placeholder blur)
- [ ] Tester l'accessibilité
- [ ] Ajouter les tests (optionnel)
- [ ] Documenter l'API attendue

---

## Support

Pour toute question:
1. Consulter `README.md`
2. Consulter `VISUAL-STATES.md`
3. Voir `cards-example.tsx` pour des exemples complets
4. Voir `BATCH2-RECAP.md` pour le récapitulatif

Bon développement ! 🚀
