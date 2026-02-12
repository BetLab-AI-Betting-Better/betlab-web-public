"use client"

import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity"
import type { PredictionData, MatchResultPrediction } from "@/core/entities/predictions/prediction.entity"
import type { MatchDetailVM } from "@/application/view-models/match-detail/match-detail.vm"
import { getMatch1x2, getMatchXg } from "@/application/view-models/match-detail/match-detail.selectors"
import { formatMarketLabel } from "@/application/view-models/fixtures/market-label.fr"

interface ModelNarrationProps {
  match: MatchDetail
  prediction?: PredictionData
  predictions?: PredictionData[]
  vm?: MatchDetailVM
}

function formatPercent(value?: number) {
  if (value === undefined || value === null || Number.isNaN(value)) return "--"
  return `${(value * 100).toFixed(1)}%`
}

function buildNarration(match: MatchDetail, prediction?: PredictionData): string {
  if (!prediction && !match.probabilities) {
    return "Donnees de modele indisponibles pour ce match."
  }

  if (prediction && prediction.type === "match_result") {
    const p = prediction as MatchResultPrediction

    // If we have a specific best market (value bet), use it for narration
    if (p.best_market && typeof p.best_market === "object") {
      const bm = p.best_market as any
      const marketKey = bm.market || bm.label
      if (marketKey) {
        const label = formatMarketLabel(marketKey, {
          homeName: match.homeTeam.name,
          awayName: match.awayTeam.name,
        })
        const probValue = bm.prob ? ` (${formatPercent(bm.prob)})` : ""
        const xgHome = p.xG?.home ?? 0
        const xgAway = p.xG?.away ?? 0
        const reasoning = p.reasoning ? ` ${p.reasoning}` : ""

        return `Projection : ${label}${probValue}. xG attendus : ${xgHome.toFixed(2)}-${xgAway.toFixed(2)}.${reasoning}`
      }
    }

    const home = p.homeWin?.probability ?? 0
    const draw = p.draw?.probability ?? 0
    const away = p.awayWin?.probability ?? 0
    const best = Math.max(home, draw, away)
    const bestLabel = best === home ? "V1" : best === draw ? "Nul" : "V2"
    const xgHome = p.xG?.home ?? 0
    const xgAway = p.xG?.away ?? 0
    const reasoning = p.reasoning ? ` ${p.reasoning}` : ""

    return `Projection ${bestLabel} (${formatPercent(best)}). xG attendus: ${xgHome.toFixed(2)}-${xgAway.toFixed(2)}.${reasoning}`
  }

  if (!prediction && match.probabilities) {
    const probs = getMatch1x2(match)
    const xg = getMatchXg(match)
    if (probs) {
      const best = Math.max(probs.home, probs.draw, probs.away)
      const bestLabel = best === probs.home ? "V1" : best === probs.draw ? "Nul" : "V2"
      return `Projection ${bestLabel} (${formatPercent(best)}). xG attendus: ${xg.home.toFixed(2)}-${xg.away.toFixed(2)}.`
    }
  }

  return `Le modele fournit des probabilites pour le marche "${prediction?.type ?? "inconnu"}".`
}

function formatLabel(label: string, match: MatchDetail): string {
  if (label === "first_to_score.home") return `Premier but : ${match.homeTeam.name}`
  if (label === "first_to_score.away") return `Premier but : ${match.awayTeam.name}`
  return label.replace(/_/g, " ")
}

export function ModelNarration({ match, prediction, predictions, vm }: ModelNarrationProps) {
  const narration = vm ? buildNarration(vm.match, prediction) : buildNarration(match, prediction)
  const opportunities =
    prediction?.type === "match_result"
      ? (prediction as MatchResultPrediction).analytics?.opportunities ?? []
      : []

  return (
    <div className="rounded-lg border border-[var(--navy)]/10 bg-[var(--navy-ultra-light)] p-4">
      <div className="text-xs font-semibold text-[var(--navy)] uppercase tracking-wide">Narration du modele</div>
      <p className="text-sm text-[var(--text-primary)] mt-2 leading-relaxed">{narration}</p>

      {opportunities.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-semibold text-[var(--navy)] uppercase tracking-wide">
            Opportunites detectees
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {opportunities.map((o) => (
              <span
                key={`${o.type}-${o.label}`}
                className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] text-[var(--navy)]"
              >
                {formatLabel(o.label, match)} ? {formatPercent(o.prob)}
              </span>
            ))}
          </div>
        </div>
      )}

      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-semibold text-[var(--navy)]">
          Voir les donnees du marche selectionne
        </summary>
        <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-black/80 p-3 text-[11px] text-white">
          {JSON.stringify(prediction ?? {}, null, 2)}
        </pre>
      </details>

      {predictions && predictions.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs font-semibold text-[var(--navy)]">
            Voir toutes les predictions du match
          </summary>
          <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-black/80 p-3 text-[11px] text-white">
            {JSON.stringify(predictions, null, 2)}
          </pre>
        </details>
      )}
    </div>
  )
}
