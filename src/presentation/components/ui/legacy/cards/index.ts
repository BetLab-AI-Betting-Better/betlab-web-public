/**
 * BetLab Cards - Export centralisé
 *
 * Tous les composants de cartes pour l'application BetLab
 */

// Match Cards
export { MatchCard, MatchCardCompact, type MatchCardProps } from "./match-card"
export { MatchCardSkeleton, MatchCardSkeletonCompact } from "./match-card-skeleton"

// Prediction Cards
export { PredictionCard, type PredictionCardProps, type PredictionType } from "./prediction-card"

// Prediction Variants
export {
  Over15Card,
  BTTSCard,
  ExactScoreCard,
  HTFTCard,
  HalfCompareCard,
  CleanSheetCard,
  CornersCard,
  InternalProbabilitiesCard
} from "./prediction-variants"
