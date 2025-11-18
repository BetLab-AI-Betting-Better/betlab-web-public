# BetLab Cards Components

Composants de cartes personnalisés pour l'application BetLab. Design mobile-first optimisé pour afficher les matchs et prédictions.

## Composants disponibles

### 1. MatchCard

Carte pour afficher un match avec ses informations et prédictions.

**Import:**
```typescript
import { MatchCard, MatchCardCompact } from "@/presentation/components/ui/legacy/cards"
```

**Props:**
```typescript
interface MatchCardProps {
  match: {
    id: number
    homeTeam: { name: string; logo: string }
    awayTeam: { name: string; logo: string }
    league: { name: string; logo: string }
    date: string
    status: 'scheduled' | 'live' | 'finished'
    score?: { home: number; away: number }
  }
  prediction?: {
    type: string
    value: string
    confidence: 'high' | 'medium' | 'low'
    edge?: number
  }
  isFavorite?: boolean
  onToggleFavorite?: () => void
  onClick?: () => void
  compact?: boolean
  className?: string
}
```

**Variants:**
- `MatchCard` - Version complète (140px min height)
- `MatchCardCompact` - Version compacte (100px min height)

**Usage:**
```tsx
<MatchCard
  match={matchData}
  prediction={predictionData}
  isFavorite={false}
  onToggleFavorite={() => console.log('Toggle favorite')}
  onClick={() => console.log('Card clicked')}
/>

<MatchCardCompact match={matchData} prediction={predictionData} />
```

**États:**
- `scheduled` - Match à venir
- `live` - Match en cours (affiche LiveBadge)
- `finished` - Match terminé (affiche le score)

---

### 2. MatchCardSkeleton

État de chargement pour MatchCard.

**Import:**
```typescript
import { MatchCardSkeleton, MatchCardSkeletonCompact } from "@/presentation/components/ui/legacy/cards"
```

**Usage:**
```tsx
<MatchCardSkeleton />
<MatchCardSkeletonCompact />
```

---

### 3. PredictionCard

Carte de base pour afficher une prédiction détaillée.

**Import:**
```typescript
import { PredictionCard } from "@/presentation/components/ui/legacy/cards"
```

**Props:**
```typescript
interface PredictionCardProps {
  type: 'over15' | 'btts' | 'exactScore' | 'htft' | 'halfCompare' | 'cleanSheet' | 'corners' | 'internal'
  title: string
  confidence: 'high' | 'medium' | 'low'
  edge?: number
  value: string | number
  recommendation?: string
  stats?: Record<string, string | number>
  updatedAt?: Date
  gradient?: boolean
  children?: React.ReactNode
  onCTAClick?: () => void
  icon?: LucideIcon
  className?: string
}
```

**Usage:**
```tsx
<PredictionCard
  type="over15"
  title="Over/Under 1.5 Buts"
  confidence="high"
  edge={12.5}
  value="Over 1.5"
  recommendation="Forte probabilité d'au moins 2 buts"
  stats={{
    "Moyenne buts": 2.8,
    "Over15 (10 derniers)": "7/10"
  }}
  updatedAt={new Date()}
  gradient
  onCTAClick={() => console.log('CTA clicked')}
/>
```

---

### 4. Prediction Variants

8 variantes spécialisées pour différents types de prédictions.

#### Over15Card
Prédiction Over/Under 1.5 buts

```tsx
import { Over15Card } from "@/presentation/components/ui/legacy/cards"

<Over15Card
  confidence="high"
  edge={15.2}
  value="Over 1.5"
  overProbability={68}
  underProbability={32}
  averageGoals={2.8}
  lastMatches={{ over15: 7, total: 10 }}
  updatedAt={new Date()}
/>
```

#### BTTSCard
Both Teams To Score

```tsx
import { BTTSCard } from "@/presentation/components/ui/legacy/cards"

<BTTSCard
  confidence="medium"
  edge={8.5}
  value="BTTS Oui"
  bttsYesProbability={62}
  bttsNoProbability={38}
  homeGoalsAvg={1.8}
  awayGoalsAvg={1.5}
  updatedAt={new Date()}
/>
```

#### ExactScoreCard
Score exact

```tsx
import { ExactScoreCard } from "@/presentation/components/ui/legacy/cards"

<ExactScoreCard
  confidence="medium"
  edge={10.2}
  value="2-1"
  topScores={[
    { score: "2-1", probability: 18 },
    { score: "1-1", probability: 15 },
    { score: "2-0", probability: 12 }
  ]}
  updatedAt={new Date()}
/>
```

#### HTFTCard
Half Time / Full Time

```tsx
import { HTFTCard } from "@/presentation/components/ui/legacy/cards"

<HTFTCard
  confidence="high"
  edge={12.8}
  value="Domicile/Domicile"
  predictions={[
    { label: "Domicile / Domicile", probability: 45 },
    { label: "Nul / Domicile", probability: 22 }
  ]}
  updatedAt={new Date()}
/>
```

#### HalfCompareCard
Comparaison mi-temps

```tsx
import { HalfCompareCard } from "@/presentation/components/ui/legacy/cards"

<HalfCompareCard
  confidence="medium"
  edge={7.5}
  value="2ème mi-temps"
  firstHalfGoals={1.2}
  secondHalfGoals={1.8}
  moreGoalsIn="second"
  probability={65}
  updatedAt={new Date()}
/>
```

#### CleanSheetCard
Clean Sheet

```tsx
import { CleanSheetCard } from "@/presentation/components/ui/legacy/cards"

<CleanSheetCard
  confidence="low"
  edge={5.2}
  value="Domicile"
  homeCleanSheetProb={35}
  awayCleanSheetProb={28}
  homeDefenseRating={7.5}
  awayDefenseRating={6.8}
  updatedAt={new Date()}
/>
```

#### CornersCard
Corners

```tsx
import { CornersCard } from "@/presentation/components/ui/legacy/cards"

<CornersCard
  confidence="high"
  edge={14.2}
  value="Over 8.5"
  totalCornersAvg={10.5}
  over85Probability={72}
  homeAvg={5.8}
  awayAvg={4.7}
  updatedAt={new Date()}
/>
```

#### InternalProbabilitiesCard
Probabilités internes

```tsx
import { InternalProbabilitiesCard } from "@/presentation/components/ui/legacy/cards"

<InternalProbabilitiesCard
  confidence="high"
  edge={11.5}
  value="Victoire Domicile"
  homeWin={55}
  draw={25}
  awayWin={20}
  updatedAt={new Date()}
  gradient
/>
```

---

## Composants communs

### ConfidenceBadge

Badge de confiance pour les prédictions.

```tsx
import { ConfidenceBadge } from "@/presentation/components/ui/legacy/common"

<ConfidenceBadge level="high" />
<ConfidenceBadge level="medium" showLabel={false} />
```

### EdgeChip

Chip affichant l'edge d'une prédiction.

```tsx
import { EdgeChip } from "@/presentation/components/ui/legacy/common"

<EdgeChip edge={12.5} />
<EdgeChip edge={-5.2} compact />
```

### LiveBadge

Badge pour les matchs en direct.

```tsx
import { LiveBadge } from "@/presentation/components/ui/legacy/common"

<LiveBadge />
<LiveBadge pulse={false} />
```

---

## Exemple complet

Voir `lib/components/examples/cards-example.tsx` pour une démonstration interactive complète.

---

## Features

- Design mobile-first
- Support du dark mode
- Animations smooth (framer-motion compatible)
- Touch feedback (active:scale-98)
- TypeScript strict
- Images optimisées (next/image)
- États de chargement (skeleton)
- Responsive (mobile → desktop)
- Swipe actions (favoris)
- Accessibility (ARIA labels)

---

## Styles

Les cartes utilisent les composants shadcn/ui comme base:
- Card, CardHeader, CardContent, CardFooter
- Badge
- Skeleton
- Progress

Toutes les couleurs respectent le design system BetLab et supportent le dark mode automatiquement.

---

## Notes

- Les logos doivent être fournis en tant qu'URLs valides
- Les dates sont formatées automatiquement en heure locale
- Le timestamp "Il y a X min" se met à jour automatiquement
- Les animations de swipe sont optionnelles (nécessite framer-motion)
