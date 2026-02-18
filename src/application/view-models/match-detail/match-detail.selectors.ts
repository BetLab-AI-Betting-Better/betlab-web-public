import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity";
import type { MatchResultPrediction } from "@/core/entities/predictions/prediction.entity";

export type Match1x2 = { home: number; draw: number; away: number };
export type MatchXG = { home: number; away: number; source: "inputs" | "prediction" | "fallback" };

export function getMatchInputs(match: MatchDetail) {
  return match.probabilities?.inputs ?? null;
}

export function getMatchPrediction(match: MatchDetail) {
  return match.predictions?.find((p) => p.type === "match_result") as MatchResultPrediction | undefined;
}

export function getMatch1x2(match: MatchDetail, prediction?: MatchResultPrediction): Match1x2 | null {
  const markets = match.probabilities?.markets?.["1x2"];
  if (markets) {
    // Scaling to 100 for consistency with home view model if needed, but let's keep 0-1 for raw selectors
    return { home: markets.home, draw: markets.draw, away: markets.away };
  }
  if (prediction?.homeWin && prediction?.draw && prediction?.awayWin) {
    return {
      home: prediction.homeWin.probability,
      draw: prediction.draw.probability,
      away: prediction.awayWin.probability,
    };
  }
  return null;
}

export function getBestMarket(match: MatchDetail) {
  const prediction = getMatchPrediction(match);
  if (!prediction) return null;

  const direct = prediction.best_market;

  if (direct && direct.prob !== undefined) {
    return {
      market: direct.market ?? direct.label,
      prob: direct.prob ?? 0,
      odds: direct.odds,
      edge: direct.edge,
      successRate: direct.successRate,
      sampleSize: direct.sampleSize,
    };
  }

  // Fallback to opportunities
  const opps = prediction.analytics?.opportunities ?? [];
  if (opps.length > 0) {
    const best = opps.reduce((acc, cur) => (cur.prob > acc.prob ? cur : acc));
    return {
      market: best.label,
      prob: best.prob
    };
  }

  return null;
}

export function getCandidateMarkets(match: MatchDetail) {
  const prediction = getMatchPrediction(match);
  if (!prediction) return [];

  const directCandidates = prediction.market_candidates ?? [];
  if (directCandidates.length > 0) {
    return directCandidates
      .filter((candidate) => Number.isFinite(candidate.prob))
      .map((candidate) => ({
        market: candidate.market,
        label: candidate.label,
        type: candidate.type,
        prob: candidate.prob,
        odds: candidate.odds,
        edge: candidate.edge,
        successRate: candidate.successRate,
        sampleSize: candidate.sampleSize,
        isBest: candidate.isBest,
      }));
  }

  return (prediction.analytics?.opportunities ?? [])
    .filter((opportunity) => Number.isFinite(opportunity.prob))
    .map((opportunity) => ({
      market: opportunity.market ?? opportunity.label,
      label: opportunity.label,
      type: opportunity.type,
      prob: opportunity.prob,
      odds: undefined,
      edge: undefined,
      successRate: opportunity.successRate,
      sampleSize: opportunity.sampleSize,
      isBest: undefined,
    }));
}

export function getMatchConfidence(match: MatchDetail, prediction?: MatchResultPrediction) {
  const probs = getMatch1x2(match, prediction);
  if (!probs) return "low" as const;
  const maxProb = Math.max(probs.home, probs.draw, probs.away);
  if (maxProb >= 0.6) return "high" as const;
  if (maxProb >= 0.45) return "medium" as const;
  return "low" as const;
}

export function getMatchXg(match: MatchDetail, prediction?: MatchResultPrediction): MatchXG {
  const inputs = getMatchInputs(match);
  if (inputs && Number.isFinite(inputs.mu_home) && Number.isFinite(inputs.mu_away)) {
    return { home: inputs.mu_home, away: inputs.mu_away, source: "inputs" };
  }
  if (prediction && Number.isFinite(prediction.xG?.home) && Number.isFinite(prediction.xG?.away)) {
    return { home: prediction.xG.home, away: prediction.xG.away, source: "prediction" };
  }
  return { home: 0, away: 0, source: "fallback" };
}

export function getMatchFormIndex(match: MatchDetail, prediction?: MatchResultPrediction) {
  const inputs = getMatchInputs(match);
  if (inputs && inputs.form_index_home !== undefined && inputs.form_index_away !== undefined) {
    return { home: inputs.form_index_home, away: inputs.form_index_away };
  }
  const form = prediction?.analytics?.formIndex;
  return form ? { home: form.home, away: form.away } : null;
}

export function getMatchDefenseFactor(match: MatchDetail, prediction?: MatchResultPrediction) {
  const inputs = getMatchInputs(match);
  if (inputs && inputs.defense_factor_home !== undefined && inputs.defense_factor_away !== undefined) {
    return { home: inputs.defense_factor_home, away: inputs.defense_factor_away };
  }
  const def = prediction?.analytics?.defenseFactor;
  return def ? { home: def.home, away: def.away } : null;
}

export function getMatchInjuryFactor(match: MatchDetail, prediction?: MatchResultPrediction) {
  const inputs = getMatchInputs(match);
  if (inputs && inputs.injury_factor_home !== undefined && inputs.injury_factor_away !== undefined) {
    return { home: inputs.injury_factor_home, away: inputs.injury_factor_away };
  }
  const inj = prediction?.analytics?.injuryFactor;
  return inj ? { home: inj.home, away: inj.away } : null;
}

export function getMatchRestHours(match: MatchDetail, prediction?: MatchResultPrediction) {
  const inputs = getMatchInputs(match);
  if (inputs && inputs.rest_hours_home !== undefined && inputs.rest_hours_away !== undefined) {
    return { home: inputs.rest_hours_home, away: inputs.rest_hours_away };
  }
  const fatigue = prediction?.analytics?.fatigue?.restHours;
  return fatigue ? { home: fatigue.home, away: fatigue.away } : null;
}

export function getMatchRatings(match: MatchDetail, prediction?: MatchResultPrediction) {
  const inputs = getMatchInputs(match);
  if (inputs && inputs.rating_home !== undefined && inputs.rating_away !== undefined) {
    return { home: inputs.rating_home, away: inputs.rating_away };
  }
  const ratings = prediction?.analytics?.ratings;
  return ratings ? { home: ratings.home, away: ratings.away } : null;
}
