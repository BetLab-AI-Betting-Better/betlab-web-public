"use client"

import { Trophy } from "lucide-react"
import { cn } from "@/shared/utils"
import type { MatchResultCardVM } from "@/application/view-models/match-detail/prediction-cards.vm"

interface MatchResultCardProps {
  vm: MatchResultCardVM
}

export function MatchResultCard({ vm }: MatchResultCardProps) {
  if (!vm.available) {
    return (
      <div className="overflow-hidden border rounded-lg bg-card">
        <div className="p-6">
          <div className="text-center space-y-4 py-8">
            <h3 className="text-lg font-semibold">Donnees non disponibles</h3>
            <p className="text-sm text-muted-foreground">
              Les probabilites de resultat ne sont pas disponibles pour ce match.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden border rounded-lg bg-card">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[var(--navy)]" />
            <h3 className="text-lg font-semibold">{vm.title}</h3>
          </div>
          {vm.confidence && (
            <span className={cn("px-3 py-1 rounded-full text-xs font-medium", vm.confidence.className)}>
              {vm.confidence.label}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {vm.xg && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="text-center flex-1">
              <div className="text-xs text-muted-foreground mb-1">xG Domicile</div>
              <div className="text-lg font-bold">{vm.xg.home}</div>
            </div>
            <div className="text-xs text-muted-foreground">vs</div>
            <div className="text-center flex-1">
              <div className="text-xs text-muted-foreground mb-1">xG Exterieur</div>
              <div className="text-lg font-bold">{vm.xg.away}</div>
            </div>
          </div>
        )}

        {vm.rows.map((row) => (
          <div key={row.label} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">{row.label}</span>
              <span className="font-bold text-lg">{row.probability.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className={cn("h-full bg-[var(--lime)] transition-all duration-500")}
                style={{ width: `${row.probability}%` }}
              />
            </div>
            {row.odds && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Cote juste</span>
                <span className="text-sm font-semibold text-[var(--navy)]">
                  {row.odds.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        ))}

        {vm.reasoning && (
          <div className="mt-4 p-4 bg-muted rounded-lg border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {vm.reasoning}
            </p>
          </div>
        )}

        {vm.bestBetLabel && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between p-3 bg-[var(--lime)]/10 rounded-lg">
              <span className="text-sm font-medium">Meilleur pari</span>
              <span className="text-sm font-bold text-[var(--navy)]">
                {vm.bestBetLabel}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
