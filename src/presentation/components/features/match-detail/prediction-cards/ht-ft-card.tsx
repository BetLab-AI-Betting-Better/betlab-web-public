"use client"

import { BadgePercent } from "lucide-react"
import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity"
import type { HtFtProbabilitiesResponse, HtFtOutcome } from "@/core/entities/match-detail/ht-ft.entity"
import { cn } from "@/shared/utils"

interface HtFtCardProps {
  match: MatchDetail
  data: HtFtProbabilitiesResponse
}

const htStates = [
  { id: "H", label: (home: string) => `${home} mène à la MT` },
  { id: "D", label: () => "Score nul à la MT" },
  { id: "A", label: (home: string, away: string) => `${away} mène à la MT` },
] as const

const ftStates = [
  { id: "H", label: (home: string) => `${home} gagne à la fin` },
  { id: "D", label: () => "Match nul à la fin" },
  { id: "A", label: (_home: string, away: string) => `${away} gagne à la fin` },
] as const

const outcomeLabels: Record<HtFtOutcome, string> = {
  HH: "Domicile / Domicile",
  HD: "Domicile / Nul",
  HA: "Domicile / Extérieur",
  DH: "Nul / Domicile",
  DD: "Nul / Nul",
  DA: "Nul / Extérieur",
  AH: "Extérieur / Domicile",
  AD: "Extérieur / Nul",
  AA: "Extérieur / Extérieur",
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

function formatOdds(value?: number) {
  if (!value) return "-"
  return value.toFixed(2)
}

export function HtFtCard({ match, data }: HtFtCardProps) {
  const entries = Object.entries(data.probabilities) as [HtFtOutcome, number][]
  const topOutcomes = [...entries].sort((a, b) => b[1] - a[1]).slice(0, 3)
  const topOutcomeId = topOutcomes[0]?.[0]

  return (
    <div className="overflow-hidden border rounded-lg bg-card">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BadgePercent className="w-5 h-5 text-[var(--navy)] dark:text-[var(--lime)]" />
          <h3 className="text-lg font-semibold">Mi-temps / Temps plein</h3>
        </div>
        <span className="text-xs text-muted-foreground">Modèle {data.model_version}</span>
      </div>

      <div className="p-4 space-y-6">
        <section>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Top scénarios</h4>
          <div className="grid gap-3 md:grid-cols-3">
            {topOutcomes.map(([outcome, prob]) => {
              const odds = data.implied_odds[outcome]
              return (
                <div
                  key={outcome}
                  className="p-3 rounded-lg border bg-background/60 dark:bg-background/40"
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>{outcomeLabels[outcome]}</span>
                    <span>Cote {formatOdds(odds)}</span>
                  </div>
                  <div className="text-2xl font-semibold">{formatPercent(prob)}</div>
                </div>
              )
            })}
          </div>
        </section>

        <section>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Grille complète</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground pb-2"></th>
                  {ftStates.map((state) => (
                    <th key={state.id} className="text-left text-xs font-medium text-muted-foreground pb-2">
                      {state.label(match.homeTeam.name, match.awayTeam.name)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {htStates.map((htState) => (
                  <tr key={htState.id} className="border-t">
                    <td className="py-3 pr-4 text-xs font-medium text-muted-foreground">
                      {htState.label(match.homeTeam.name, match.awayTeam.name)}
                    </td>
                    {ftStates.map((ftState) => {
                      const outcome = `${htState.id}${ftState.id}` as HtFtOutcome
                      const value = data.probabilities[outcome]
                      const odds = data.implied_odds[outcome]
                      return (
                        <td key={ftState.id} className="py-3 pr-4">
                          <div
                            className={cn(
                              "p-3 rounded-lg border bg-background/80 dark:bg-background/40",
                              outcome === topOutcomeId && "border-[var(--lime)]"
                            )}
                          >
                            <div className="text-lg font-semibold">{formatPercent(value)}</div>
                            <div className="text-xs text-muted-foreground">Cote {formatOdds(odds)}</div>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          <div className="p-3 rounded-lg bg-muted/60">
            <div className="text-xs text-muted-foreground">Ratio MT/FT (ligue)</div>
            <div className="text-xl font-semibold">{data.diagnostics.ht_ratio_league.toFixed(2)}</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/60">
            <div className="text-xs text-muted-foreground">{match.homeTeam.name} (MT)</div>
            <div className="text-xl font-semibold">{data.diagnostics.ht_ratio_home.toFixed(2)}</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/60">
            <div className="text-xs text-muted-foreground">{match.awayTeam.name} (MT)</div>
            <div className="text-xl font-semibold">{data.diagnostics.ht_ratio_away.toFixed(2)}</div>
          </div>
        </section>
      </div>
    </div>
  )
}
