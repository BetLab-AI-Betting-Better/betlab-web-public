/**
 * Badges & Chips Snippets - BetLab
 *
 * Ce fichier contient des snippets et exemples d'usage pratiques
 * pour les composants ConfidenceBadge, EdgeChip et LiveBadge.
 *
 * Copiez-collez ces exemples dans votre code pour un démarrage rapide.
 */

/**
 * IMPORTS
 * Importez les composants depuis le barrel export
 */
/*
import {
  ConfidenceBadge,
  EdgeChip,
  LiveBadge,
  type ConfidenceBadgeProps,
  type EdgeChipProps,
  type LiveBadgeProps,
} from "@/presentation/components/ui"
*/

/**
 * ═══════════════════════════════════════════════════════════════
 * CONFIDENCE BADGE - Exemples d'usage
 * ═══════════════════════════════════════════════════════════════
 */

// Basique - Avec label
const confidenceBasic = `<ConfidenceBadge level="high" showLabel />`

// Toutes les tailles
const confidenceSizes = `
<ConfidenceBadge level="high" size="sm" showLabel />
<ConfidenceBadge level="high" size="md" showLabel />
<ConfidenceBadge level="high" size="lg" showLabel />
`

// Tous les niveaux
const confidenceLevels = `
<ConfidenceBadge level="high" showLabel />
<ConfidenceBadge level="medium" showLabel />
<ConfidenceBadge level="low" showLabel />
`

// Icône uniquement (pas de label)
const confidenceIconOnly = `<ConfidenceBadge level="high" />`

// Label sans icône
const confidenceLabelOnly = `<ConfidenceBadge level="high" showLabel showIcon={false} />`

// Dans une card de pronostic
const confidenceInCard = `
<Card>
  <CardContent className="pt-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold">PSG vs OM</p>
        <p className="text-sm text-text-secondary">Ligue 1</p>
      </div>
      <ConfidenceBadge level="high" size="lg" showLabel />
    </div>
  </CardContent>
</Card>
`

// Avec état dynamique
const confidenceDynamic = `
const getConfidenceLevel = (probability: number): "high" | "medium" | "low" => {
  if (probability >= 0.7) return "high"
  if (probability >= 0.5) return "medium"
  return "low"
}

<ConfidenceBadge level={getConfidenceLevel(match.probability)} showLabel />
`

/**
 * ═══════════════════════════════════════════════════════════════
 * EDGE CHIP - Exemples d'usage
 * ═══════════════════════════════════════════════════════════════
 */

// Basique
const edgeBasic = `<EdgeChip edge={8.2} />`

// Avec label "Edge:"
const edgeWithLabel = `<EdgeChip edge={8.2} showLabel />`

// Avec tooltip
const edgeWithTooltip = `<EdgeChip edge={8.2} showTooltip />`

// Tous les seuils de couleur
const edgeThresholds = `
<EdgeChip edge={12.5} />  {/* Excellent (vert) + animation pulse */}
<EdgeChip edge={6.3} />   {/* Good (lime) */}
<EdgeChip edge={3.2} />   {/* Fair (orange) */}
<EdgeChip edge={1.1} />   {/* Low (gris) */}
`

// Edge négatif
const edgeNegative = `<EdgeChip edge={-2.3} />`

// Tailles
const edgeSizes = `
<EdgeChip edge={8.2} size="sm" />
<EdgeChip edge={8.2} size="md" />
`

// Sans icône
const edgeNoIcon = `<EdgeChip edge={8.2} showIcon={false} />`

// Dans une liste de pronostics
const edgeInList = `
<div className="space-y-2">
  {predictions.map(pred => (
    <div key={pred.id} className="flex items-center justify-between p-3 border rounded">
      <span>{pred.name}</span>
      <div className="flex items-center gap-2">
        <span className="font-bold">{pred.odds}</span>
        <EdgeChip edge={pred.edge} size="sm" showTooltip />
      </div>
    </div>
  ))}
</div>
`

// Avec calcul dynamique
const edgeDynamic = `
const calculateEdge = (odds: number, probability: number): number => {
  const impliedProb = 1 / odds
  return ((probability - impliedProb) / impliedProb) * 100
}

const edge = calculateEdge(match.odds, match.probability)
<EdgeChip edge={edge} showTooltip />
`

// Utiliser les fonctions utilitaires
const edgeUtilities = `
import { getEdgeCategory, formatEdge } from "@/presentation/components/ui"

const edge = 8.2
const category = getEdgeCategory(edge)  // "good"
const formatted = formatEdge(edge)      // "+8.2%"

// Logique conditionnelle
if (category === "excellent") {
  // Recommander fortement le pari
}
`

/**
 * ═══════════════════════════════════════════════════════════════
 * LIVE BADGE - Exemples d'usage
 * ═══════════════════════════════════════════════════════════════
 */

// Basique (solid, animé)
const liveBasic = `<LiveBadge />`

// Avec dot
const liveWithDot = `<LiveBadge showDot />`

// Avec glow effect
const liveWithGlow = `<LiveBadge showDot showGlow />`

// Tous les variants
const liveVariants = `
<LiveBadge variant="solid" />
<LiveBadge variant="outline" />
<LiveBadge variant="ghost" />
`

// Mode compact (dot uniquement)
const liveCompact = `<LiveBadge compact />`

// Tailles
const liveSizes = `
<LiveBadge size="sm" />
<LiveBadge size="md" />
`

// Sans animation
const liveNoAnimation = `<LiveBadge animated={false} />`

// Dans une card de match live
const liveInCard = `
<Card>
  <CardContent className="pt-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold">Real Madrid vs Barcelona</p>
        <p className="text-sm text-text-secondary">La Liga - 34' min</p>
      </div>
      <LiveBadge showDot showGlow />
    </div>
    <div className="flex items-center gap-2 mt-3">
      <span className="text-2xl font-bold">2 - 1</span>
    </div>
  </CardContent>
</Card>
`

// Liste de matchs avec indicateur compact
const liveInList = `
<div className="space-y-2">
  {matches.map(match => (
    <div key={match.id} className="flex items-center gap-3 p-3 border rounded">
      {match.isLive && <LiveBadge compact />}
      <span className="flex-1">{match.name}</span>
      <span className="font-semibold">{match.score}</span>
    </div>
  ))}
</div>
`

// Conditionnel selon statut
const liveConditional = `
{match.status === "live" && (
  <LiveBadge showDot showGlow />
)}
`

/**
 * ═══════════════════════════════════════════════════════════════
 * COMBINAISONS - Exemples d'usage combiné
 * ═══════════════════════════════════════════════════════════════
 */

// Card de pronostic complète
const combinedPredictionCard = `
<Card>
  <CardContent className="pt-6 space-y-3">
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold">Liverpool vs Arsenal</p>
        <p className="text-sm text-text-secondary">Premier League - Dans 2h</p>
      </div>
      {match.isLive && <LiveBadge showDot />}
    </div>

    <div className="flex items-center justify-between pt-2 border-t">
      <div className="flex items-center gap-2">
        <span className="text-sm">Liverpool victoire</span>
        <span className="font-bold">2.30</span>
      </div>
      <div className="flex items-center gap-2">
        <ConfidenceBadge level="high" size="sm" />
        <EdgeChip edge={11.2} size="sm" showTooltip />
      </div>
    </div>
  </CardContent>
</Card>
`

// Liste de matchs live avec tous les indicateurs
const combinedLiveMatches = `
<div className="space-y-3">
  {liveMatches.map(match => (
    <Card key={match.id}>
      <CardContent className="pt-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{match.home} vs {match.away}</p>
            <p className="text-sm text-text-secondary">{match.league} - {match.minute}'</p>
          </div>
          <LiveBadge showDot showGlow />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xl font-bold">{match.score}</span>
        </div>

        {match.prediction && (
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm text-text-secondary">
              Prono: {match.prediction.name}
            </span>
            <div className="flex items-center gap-2">
              <ConfidenceBadge level={match.prediction.confidence} size="sm" />
              <EdgeChip edge={match.prediction.edge} size="sm" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  ))}
</div>
`

// Tableau de pronostics avec tri par edge
const combinedPredictionsTable = `
<div className="space-y-2">
  <h3 className="font-semibold">Meilleurs pronostics du jour</h3>
  {predictions
    .sort((a, b) => b.edge - a.edge)
    .map(pred => (
      <div
        key={pred.id}
        className="flex items-center justify-between p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-900"
      >
        <div className="flex-1">
          <p className="font-semibold">{pred.match}</p>
          <p className="text-sm text-text-secondary">{pred.prediction}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-bold text-lg">{pred.odds}</span>
          <EdgeChip edge={pred.edge} size="sm" />
          <ConfidenceBadge level={pred.confidence} size="sm" />
        </div>
      </div>
    ))}
</div>
`

// Dashboard stats avec badges
const combinedDashboard = `
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <Card>
    <CardContent className="pt-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Matchs en direct</span>
          <LiveBadge compact />
        </div>
        <p className="text-3xl font-bold">{liveMatchesCount}</p>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="pt-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Confiance élevée</span>
          <ConfidenceBadge level="high" size="sm" />
        </div>
        <p className="text-3xl font-bold">{highConfidenceCount}</p>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="pt-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Edge moyen</span>
          <EdgeChip edge={averageEdge} size="sm" />
        </div>
        <p className="text-3xl font-bold">{formatEdge(averageEdge)}</p>
      </div>
    </CardContent>
  </Card>
</div>
`

/**
 * ═══════════════════════════════════════════════════════════════
 * TYPES & INTERFACES - Pour référence
 * ═══════════════════════════════════════════════════════════════
 */

interface Match {
  id: string
  home: string
  away: string
  league: string
  status: "upcoming" | "live" | "finished"
  isLive: boolean
  score?: string
  minute?: number
  prediction?: {
    name: string
    odds: number
    probability: number
    edge: number
    confidence: "high" | "medium" | "low"
  }
}

interface Prediction {
  id: string
  match: string
  prediction: string
  odds: number
  probability: number
  edge: number
  confidence: "high" | "medium" | "low"
}

/**
 * ═══════════════════════════════════════════════════════════════
 * HELPERS & UTILITIES - Fonctions utilitaires
 * ═══════════════════════════════════════════════════════════════
 */

// Calculer le edge à partir de la cote et de la probabilité
const calculateEdge = (odds: number, probability: number): number => {
  const impliedProbability = 1 / odds
  return ((probability - impliedProbability) / impliedProbability) * 100
}

// Déterminer le niveau de confiance à partir de la probabilité
const getConfidenceLevel = (probability: number): "high" | "medium" | "low" => {
  if (probability >= 0.7) return "high"
  if (probability >= 0.5) return "medium"
  return "low"
}

// Filtrer les matchs live
const filterLiveMatches = (matches: Match[]): Match[] => {
  return matches.filter(match => match.isLive && match.status === "live")
}

// Filtrer les meilleurs edges
const filterBestEdges = (predictions: Prediction[], minEdge: number = 5): Prediction[] => {
  return predictions.filter(pred => pred.edge >= minEdge).sort((a, b) => b.edge - a.edge)
}

// Filtrer par confiance élevée
const filterHighConfidence = (predictions: Prediction[]): Prediction[] => {
  return predictions.filter(pred => pred.confidence === "high")
}

export {
  // Snippets
  confidenceBasic,
  confidenceSizes,
  confidenceLevels,
  confidenceIconOnly,
  confidenceLabelOnly,
  confidenceInCard,
  confidenceDynamic,
  edgeBasic,
  edgeWithLabel,
  edgeWithTooltip,
  edgeThresholds,
  edgeNegative,
  edgeSizes,
  edgeNoIcon,
  edgeInList,
  edgeDynamic,
  edgeUtilities,
  liveBasic,
  liveWithDot,
  liveWithGlow,
  liveVariants,
  liveCompact,
  liveSizes,
  liveNoAnimation,
  liveInCard,
  liveInList,
  liveConditional,
  combinedPredictionCard,
  combinedLiveMatches,
  combinedPredictionsTable,
  combinedDashboard,

  // Helpers
  calculateEdge,
  getConfidenceLevel,
  filterLiveMatches,
  filterBestEdges,
  filterHighConfidence,
}
