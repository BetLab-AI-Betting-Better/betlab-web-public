import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity";
import type { MatchResultPrediction, ConfidenceLevel } from "@/core/entities/predictions/prediction.entity";
import { buildPredictionCardsVM, type PredictionCardsVM } from "./prediction-cards.vm";
import {
  getMatch1x2,
  getMatchConfidence,
  getMatchDefenseFactor,
  getMatchFormIndex,
  getMatchInjuryFactor,
  getMatchPrediction,
  getMatchRatings,
  getMatchRestHours,
  getMatchXg,
} from "./match-detail.selectors";

export type RadarPoint = { subject: string; A: number; B: number; fullMark: number };

export type MatchDetailVM = {
  match: MatchDetail;
  prediction?: MatchResultPrediction;
  hasProbabilities: boolean;
  header: {
    confidence: ConfidenceLevel;
  };
  overview: {
    headline: string;
    reasoning: string;
    probs: { home: number; draw: number; away: number } | null;
    confidence: ConfidenceLevel;
    formDelta: number | null;
  };
  cards: PredictionCardsVM;
  analysis: {
    xg: { home: number; away: number; source: "inputs" | "prediction" | "fallback" };
    formIndex: { home: number; away: number } | null;
    defense: { home: number; away: number } | null;
    injury: { home: number; away: number } | null;
    rest: { home: number; away: number } | null;
    ratings: { home: number; away: number } | null;
    radarData: RadarPoint[];
    opportunities: Array<{ type: string; label: string; prob: number }>
  };
};

export function buildMatchDetailVM(match: MatchDetail): MatchDetailVM {
  const prediction = getMatchPrediction(match);
  const probs = getMatch1x2(match, prediction ?? undefined);
  const confidence = getMatchConfidence(match, prediction ?? undefined);
  const reasoning = prediction?.reasoning ?? "";
  const headline = reasoning.split(".")[0] || "Analyse en cours...";

  const formIndex = getMatchFormIndex(match, prediction ?? undefined);
  const defense = getMatchDefenseFactor(match, prediction ?? undefined);
  const injury = getMatchInjuryFactor(match, prediction ?? undefined);
  const rest = getMatchRestHours(match, prediction ?? undefined);
  const ratings = getMatchRatings(match, prediction ?? undefined);
  const xg = getMatchXg(match, prediction ?? undefined);

  const radarData: RadarPoint[] = [
    {
      subject: "Attaque (xG)",
      A: xg.home * 20,
      B: xg.away * 20,
      fullMark: 100,
    },
    {
      subject: "Forme",
      A: formIndex ? (formIndex.home + 1) * 50 : 50,
      B: formIndex ? (formIndex.away + 1) * 50 : 50,
      fullMark: 100,
    },
    {
      subject: "Defense",
      A: (1 - (defense?.home ?? 0)) * 100 + 50,
      B: (1 - (defense?.away ?? 0)) * 100 + 50,
      fullMark: 100,
    },
    {
      subject: "Effectif",
      A: (injury?.home ?? 1) * 100,
      B: (injury?.away ?? 1) * 100,
      fullMark: 100,
    },
    {
      subject: "Repos",
      A: Math.min(100, (rest?.home ?? 0) / 1.68),
      B: Math.min(100, (rest?.away ?? 0) / 1.68),
      fullMark: 100,
    },
    {
      subject: "Elo",
      A: ((ratings?.home ?? 1500) - 1000) / 10,
      B: ((ratings?.away ?? 1500) - 1000) / 10,
      fullMark: 100,
    },
  ];

  return {
    match,
    prediction,
    hasProbabilities: Boolean(match.probabilities),
    header: {
      confidence,
    },
    overview: {
      headline,
      reasoning: reasoning || (match.probabilities ? `Base sur le modele ${match.probabilities.model_version}.` : ""),
      probs,
      confidence,
      formDelta: formIndex ? Math.abs(formIndex.home - formIndex.away) : null,
    },
    cards: buildPredictionCardsVM(match),
    analysis: {
      xg,
      formIndex,
      defense,
      injury,
      rest,
      ratings,
      radarData,
      opportunities: prediction?.analytics?.opportunities ?? [],
    },
  };
}
