"use client"

import { useEffect, useMemo, useState } from "react"
import { ShieldCheck, TrendingUp } from "lucide-react"
import { cn } from "@/shared/utils"
import type { MatchDetailVM } from "@/application/view-models/match-detail/match-detail.vm"

interface PredictionHeroProps {
  vm: MatchDetailVM
}

export function PredictionHero({ vm }: PredictionHeroProps) {
  const { bestMarket, candidateMarkets } = vm

  const defaultMarket = bestMarket ?? candidateMarkets[0] ?? null

  const [showCandidates, setShowCandidates] = useState(false)
  const [selectedMarketKey, setSelectedMarketKey] = useState(defaultMarket?.rawLabel ?? "")

  useEffect(() => {
    setSelectedMarketKey(defaultMarket?.rawLabel ?? "")
  }, [defaultMarket?.rawLabel])

  const selectedMarket = useMemo(
    () => candidateMarkets.find((candidate) => candidate.rawLabel === selectedMarketKey) ?? defaultMarket,
    [candidateMarkets, defaultMarket, selectedMarketKey]
  )

  if (!selectedMarket) return null

  return (
    <div className="px-4 py-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#B8CC3A]/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#003366] flex items-center justify-center shadow-lg shadow-[#003366]/20">
              <ShieldCheck className="w-5 h-5 text-[#B8CC3A]" />
            </div>
            <span className="text-xs font-bold text-[#003366] uppercase tracking-wider">
              Prono Elite v4
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#B8CC3A]/10 rounded-full border border-[#B8CC3A]/20">
            <TrendingUp className="w-3 h-3 text-[#003366]" />
            <span className="text-[10px] font-black text-[#003366] uppercase tracking-tighter">
              Confident
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Marche recommande
            </span>
            <h2 className="text-2xl font-black text-[#003366] leading-none">
              {selectedMarket.label}
            </h2>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              Probabilite
            </span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-4xl font-black text-[#003366] tracking-tighter">
                {selectedMarket.prob.toFixed(1)}
              </span>
              <span className="text-lg font-bold text-[#B8CC3A]">%</span>
            </div>
          </div>
        </div>

        {selectedMarket.odds && (
          <div className="flex items-center gap-3 pt-2">
            <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#003366] to-[#B8CC3A]"
                style={{ width: `${selectedMarket.prob}%` }}
              />
            </div>
            <div className="px-3 py-1.5 bg-[#003366] rounded-xl flex items-center gap-2">
              <span className="text-[10px] font-bold text-white/50 uppercase">Cote</span>
              <span className="text-sm font-black text-[#B8CC3A]">{selectedMarket.odds.toFixed(2)}</span>
            </div>
          </div>
        )}

        {(selectedMarket.successRate !== undefined || selectedMarket.sampleSize !== undefined) && (
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Reussite historique
            </span>
            <span className="text-xs font-bold text-[#003366]">
              {selectedMarket.successRate !== undefined ? `${(selectedMarket.successRate * 100).toFixed(1)}%` : "N/A"}
              {selectedMarket.sampleSize !== undefined ? ` (n=${selectedMarket.sampleSize})` : ""}
            </span>
          </div>
        )}

        {candidateMarkets.length > 1 && (
          <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCandidates((open) => !open)}
              className="text-left text-xs font-bold text-[#003366] hover:text-[#001f3d] transition-colors"
            >
              {showCandidates
                ? "Masquer les autres marches candidats"
                : `Voir ${candidateMarkets.length - 1} marche(s) candidat(s)`}
            </button>

            {showCandidates && (
              <div className="grid gap-2">
                {candidateMarkets
                  .filter((candidate) => candidate.rawLabel !== selectedMarket.rawLabel)
                  .map((candidate) => (
                    <button
                      key={candidate.rawLabel}
                      type="button"
                      onClick={() => setSelectedMarketKey(candidate.rawLabel)}
                      className={cn(
                        "w-full rounded-xl border px-3 py-2 text-left transition-colors",
                        "border-slate-200 bg-white hover:border-[#003366]/30 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-[#003366]">{candidate.label}</span>
                        <span className="text-xs font-black text-[#003366]">{candidate.prob.toFixed(1)}%</span>
                      </div>
                      {(candidate.successRate !== undefined || candidate.sampleSize !== undefined) && (
                        <span className="mt-1 block text-[11px] text-slate-500">
                          Reussite: {candidate.successRate !== undefined ? `${(candidate.successRate * 100).toFixed(1)}%` : "N/A"}
                          {candidate.sampleSize !== undefined ? ` | n=${candidate.sampleSize}` : ""}
                        </span>
                      )}
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
