"use client"

import { BadgePercent } from "lucide-react"
import { cn } from "@/shared/utils"
import type { HtFtCardVM } from "@/application/view-models/match-detail/prediction-cards.vm"

interface HtFtCardProps {
  vm: HtFtCardVM
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

function formatOdds(value?: number) {
  if (!value) return "-"
  return value.toFixed(2)
}

export function HtFtCard({ vm }: HtFtCardProps) {
  if (!vm.available) {
    return (
      <div className="overflow-hidden border rounded-lg bg-card">
        <div className="p-6">
          <div className="text-center space-y-4 py-8">
            <h3 className="text-lg font-semibold">Donnees non disponibles</h3>
            <p className="text-sm text-muted-foreground">
              Les probabilites Mi-temps / Fin de match ne sont pas disponibles.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const topOutcomeId = vm.topOutcomes[0]?.outcome

  return (
    <div className="overflow-hidden border rounded-lg bg-card">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BadgePercent className="w-5 h-5 text-[var(--navy)]" />
          <h3 className="text-lg font-semibold">{vm.title}</h3>
        </div>
        {vm.modelVersion && (
          <span className="text-xs text-muted-foreground">Modele {vm.modelVersion}</span>
        )}
      </div>

      <div className="p-4 space-y-6">
        <section>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Top scenarios</h4>
          <div className="grid gap-3 md:grid-cols-3">
            {vm.topOutcomes.map((outcome) => (
              <div key={outcome.outcome} className="p-3 rounded-lg border bg-background/60">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>{outcome.label}</span>
                  <span>Cote {formatOdds(outcome.odds)}</span>
                </div>
                <div className="text-2xl font-semibold">{formatPercent(outcome.probability)}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Grille complete</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground pb-2"></th>
                  {vm.rows[0]?.cells.map((cell) => (
                    <th key={cell.outcome} className="text-left text-xs font-medium text-muted-foreground pb-2">
                      {cell.outcome[1] === "H" ? "Domicile" : cell.outcome[1] === "D" ? "Nul" : "Exterieur"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vm.rows.map((row) => (
                  <tr key={row.label} className="border-t">
                    <td className="py-3 pr-4 text-xs font-medium text-muted-foreground">
                      {row.label}
                    </td>
                    {row.cells.map((cell) => (
                      <td key={cell.outcome} className="py-3 pr-4">
                        <div
                          className={cn(
                            "p-3 rounded-lg border bg-background/80",
                            cell.highlight && "border-[var(--lime)]"
                          )}
                        >
                          <div className="text-lg font-semibold">{formatPercent(cell.probability)}</div>
                          <div className="text-xs text-muted-foreground">Cote {formatOdds(cell.odds)}</div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {vm.diagnostics && (
          <section className="grid gap-3 md:grid-cols-3">
            <div className="p-3 rounded-lg bg-muted/60">
              <div className="text-xs text-muted-foreground">Ratio MT/FT (ligue)</div>
              <div className="text-xl font-semibold">{vm.diagnostics.htRatioLeague.toFixed(2)}</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/60">
              <div className="text-xs text-muted-foreground">Domicile (MT)</div>
              <div className="text-xl font-semibold">{vm.diagnostics.htRatioHome.toFixed(2)}</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/60">
              <div className="text-xs text-muted-foreground">Exterieur (MT)</div>
              <div className="text-xl font-semibold">{vm.diagnostics.htRatioAway.toFixed(2)}</div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
