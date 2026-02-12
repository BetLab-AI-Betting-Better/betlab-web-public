"use client"

import { Target } from "lucide-react"
import { cn } from "@/shared/utils"
import type { OverUnderCardVM } from "@/application/view-models/match-detail/prediction-cards.vm"

interface OverUnderCardProps {
  vm: OverUnderCardVM
}

export function OverUnderCard({ vm }: OverUnderCardProps) {
  if (!vm.available) {
    return (
      <div className="overflow-hidden border rounded-lg bg-card">
        <div className="p-6">
          <div className="text-center space-y-4 py-8">
            <h3 className="text-lg font-semibold">Donnees non disponibles</h3>
            <p className="text-sm text-muted-foreground">
              Les probabilites Over/Under ne sont pas disponibles pour ce match.
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
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Plus de 2.5 buts</span>
            <span className="font-bold text-lg">{vm.over25.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${vm.over25}%` }} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Moins de 2.5 buts</span>
            <span className="font-bold text-lg">{vm.under25.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${vm.under25}%` }} />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t">
          <div className="text-sm font-medium text-muted-foreground">Autres seuils</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground mb-2">Plus de 1.5</div>
              <div className="text-lg font-bold">{vm.over15.toFixed(1)}%</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground mb-2">Moins de 1.5</div>
              <div className="text-lg font-bold">{vm.under15.toFixed(1)}%</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground mb-2">Plus de 3.5</div>
              <div className="text-lg font-bold">{vm.over35.toFixed(1)}%</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground mb-2">Moins de 3.5</div>
              <div className="text-lg font-bold">{vm.under35.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between p-3 bg-[var(--lime)]/10 rounded-lg">
            <span className="text-sm font-medium">Meilleur pari</span>
            <span className="text-sm font-bold text-[var(--navy)]">
              {vm.bestChoice === "over" ? "Plus de 2.5 buts" : "Moins de 2.5 buts"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
