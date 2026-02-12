"use client"

import { Target } from "lucide-react"
import { cn } from "@/shared/utils"
import type { BTTSCardVM } from "@/application/view-models/match-detail/prediction-cards.vm"

interface BTTSCardProps {
  vm: BTTSCardVM
}

export function BTTSCard({ vm }: BTTSCardProps) {
  if (!vm.available) {
    return (
      <div className="overflow-hidden border rounded-lg bg-card">
        <div className="p-6">
          <div className="text-center space-y-4 py-8">
            <h3 className="text-lg font-semibold">Donnees non disponibles</h3>
            <p className="text-sm text-muted-foreground">
              Les probabilites BTTS ne sont pas disponibles pour ce match.
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
            <Target className="w-5 h-5 text-[var(--navy)]" />
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
        <div className="grid grid-cols-2 gap-3">
          <div
            className={cn(
              "p-4 rounded-lg border-2 transition-all",
              vm.bestChoice === "yes"
                ? "border-[var(--lime)] bg-[var(--lime)]/10"
                : "border-border bg-muted/50"
            )}
          >
            <div className="text-center space-y-2">
              <div className="text-xs text-muted-foreground font-medium">OUI</div>
              <div className="text-2xl font-bold">{vm.yesProbability.toFixed(1)}%</div>
              <div className="pt-2 border-t space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Cote juste</span>
                  <span className="font-semibold">
                    {vm.yesOdds ? vm.yesOdds.toFixed(2) : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "p-4 rounded-lg border-2 transition-all",
              vm.bestChoice === "no"
                ? "border-[var(--navy)] bg-[var(--navy)]/10"
                : "border-border bg-muted/50"
            )}
          >
            <div className="text-center space-y-2">
              <div className="text-xs text-muted-foreground font-medium">NON</div>
              <div className="text-2xl font-bold">{vm.noProbability.toFixed(1)}%</div>
              <div className="pt-2 border-t space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Cote juste</span>
                  <span className="font-semibold">
                    {vm.noOdds ? vm.noOdds.toFixed(2) : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg border border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {vm.reasoning}
          </p>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between p-3 bg-[var(--lime)]/10 rounded-lg">
            <span className="text-sm font-medium">Meilleur pari</span>
            <span className="text-sm font-bold text-[var(--navy)]">
              BTTS {vm.bestChoice === "yes" ? "Oui" : "Non"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
