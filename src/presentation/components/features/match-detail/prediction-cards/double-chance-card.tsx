"use client"

import React from "react"
import { cn } from "@/shared/utils"
import { Grid, Info } from "lucide-react"
import type { DoubleChanceCardVM } from "@/application/view-models/match-detail/prediction-cards.vm"

interface DoubleChanceCardProps {
    vm: DoubleChanceCardVM
}

export function DoubleChanceCard({ vm }: DoubleChanceCardProps) {
    if (!vm.available) return null

    const items = [
        { label: "1X (Home or Draw)", prob: vm.homeOrDraw, odds: vm.homeOrDrawOdds },
        { label: "12 (Home or Away)", prob: vm.homeOrAway, odds: vm.homeOrAwayOdds },
        { label: "X2 (Draw or Away)", prob: vm.drawOrAway, odds: vm.drawOrAwayOdds },
    ]

    return (
        <div className="bg-card border rounded-2xl overflow-hidden shadow-sm animation-scale-in">
            <div className="p-4 bg-[var(--navy)] border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <Grid className="text-lime w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-black text-white uppercase tracking-tight leading-none mb-1">
                            Double Chance
                        </h3>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            2 issues couvertes sur 3
                        </div>
                    </div>
                </div>
                {vm.confidence && (
                    <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        vm.confidence.className
                    )}>
                        {vm.confidence.label}
                    </div>
                )}
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {items.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center p-4 rounded-xl border bg-muted/20">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            {item.label.split(" (")[0]}
                        </span>
                        <div className="text-2xl font-black text-navy-950 mb-1">
                            {item.prob.toFixed(1)}%
                        </div>
                        {item.odds && (
                            <div className="text-[11px] font-bold text-lime-700 bg-lime/10 px-2 py-0.5 rounded-full">
                                Cote: {item.odds.toFixed(2)}
                            </div>
                        )}
                        <div className="w-full h-1.5 bg-muted rounded-full mt-4 overflow-hidden">
                            <div
                                className="h-full bg-lime"
                                style={{ width: `${item.prob}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
