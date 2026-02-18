import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity";
import type { MatchResultPrediction, ConfidenceLevel } from "@/core/entities/predictions/prediction.entity";
import { buildPredictionCardsVM, type PredictionCardsVM } from "./prediction-cards.vm";
import {
  getBestMarket,
  getCandidateMarkets,
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
import { formatMarketLabel } from "../fixtures/market-label.fr";
import { generateNarration, type NarrationResult } from "@/application/utils/match-narrator";

export type RadarPoint = { subject: string; A: number; B: number; fullMark: number };

export type MatchDetailVM = {
  match: MatchDetail;
  prediction?: MatchResultPrediction;
  hasProbabilities: boolean;
  bestMarket: {
    label: string;
    rawLabel: string;
    prob: number;
    odds?: number;
    edge?: number;
    successRate?: number;
    sampleSize?: number;
  } | null;
  candidateMarkets: Array<{
    label: string;
    rawLabel: string;
    type?: string;
    prob: number;
    odds?: number;
    edge?: number;
    successRate?: number;
    sampleSize?: number;
    isBest?: boolean;
  }>;
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
    opportunities: Array<{
      type: string;
      label: string;
      prob: number;
      market?: string;
      successRate?: number;
      sampleSize?: number;
    }>
  };
  narration: NarrationResult;
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

  const rawBestMarket = getBestMarket(match);
  const rawCandidateMarkets = getCandidateMarkets(match);
  const bestMarket = rawBestMarket ? {
    label: formatMarketLabel(rawBestMarket.market, {
      homeName: match.homeTeam.name,
      awayName: match.awayTeam.name
    }) || rawBestMarket.market,
    rawLabel: rawBestMarket.market,
    prob: rawBestMarket.prob * 100, // Scaling to 100
    odds: rawBestMarket.odds,
    edge: rawBestMarket.edge,
    successRate: rawBestMarket.successRate,
    sampleSize: rawBestMarket.sampleSize,
  } : null;
  const candidateMarkets = rawCandidateMarkets.map((candidate) => ({
    label: formatMarketLabel(candidate.market, {
      homeName: match.homeTeam.name,
      awayName: match.awayTeam.name
    }) || candidate.label || candidate.market,
    rawLabel: candidate.market,
    type: candidate.type,
    prob: candidate.prob * 100,
    odds: candidate.odds,
    edge: candidate.edge,
    successRate: candidate.successRate,
    sampleSize: candidate.sampleSize,
    isBest: candidate.isBest,
  }));
  if (bestMarket && !candidateMarkets.some((candidate) => candidate.rawLabel === bestMarket.rawLabel)) {
    candidateMarkets.unshift({
      label: bestMarket.label,
      rawLabel: bestMarket.rawLabel,
      type: undefined,
      prob: bestMarket.prob,
      odds: bestMarket.odds,
      edge: bestMarket.edge,
      successRate: bestMarket.successRate,
      sampleSize: bestMarket.sampleSize,
      isBest: true,
    });
  }

  const vmPartial = {
    match,
    prediction,
    hasProbabilities: Boolean(match.probabilities),
    bestMarket,
    candidateMarkets,
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
      opportunities: (prediction?.analytics?.opportunities ?? []).map((opportunity) => ({
        type: opportunity.type,
        label: opportunity.label,
        prob: opportunity.prob,
        market: opportunity.market,
        successRate: opportunity.successRate,
        sampleSize: opportunity.sampleSize,
      })),
    },
  } as MatchDetailVM;

  // Generate rich expert narration from all available analytics + market data
  vmPartial.narration = generateNarration(vmPartial, match.probabilities ?? null);

  return vmPartial;
}
