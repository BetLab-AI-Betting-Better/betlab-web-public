"use client"

import React from "react"
import { cn } from "@/shared/utils"
import { Target, Info } from "lucide-react"
import type { CornersCardVM } from "@/application/view-models/match-detail/prediction-cards.vm"

interface CornersCardProps {
    vm: CornersCardVM
}

export function CornersCard({ vm }: CornersCardProps) {
    if (!vm.available) return null

    return (
        <div className="bg-card border rounded-2xl overflow-hidden shadow-sm animation-scale-in">
            {/* Header */}
            <div className="p-4 bg-[var(--navy)] border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <Target className="text-lime w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-black text-white uppercase tracking-tight leading-none mb-1">
                            {vm.title}
                        </h3>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            Total attendu: <span className="text-lime">{vm.expectedTotal.toFixed(1)}</span>
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

            {/* Content */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-black border-b">
                            <th className="p-4 text-left">Ligne</th>
                            <th className="p-4 text-center">Plus (Over)</th>
                            <th className="p-4 text-center">Moins (Under)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {vm.rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-muted/30 transition-colors group">
                                <td className="p-4 font-black text-navy-950">
                                    {row.line}
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex flex-col items-center">
                                        <span className={cn(
                                            "text-sm font-bold",
                                            row.over > 60 ? "text-green-600" : "text-navy-900"
                                        )}>
                                            {row.over.toFixed(1)}%
                                        </span>
                                        <div className="w-16 h-1 rounded-full bg-muted mt-1 overflow-hidden">
                                            <div
                                                className="h-full bg-lime transition-all duration-1000"
                                                style={{ width: `${row.over}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex flex-col items-center">
                                        <span className={cn(
                                            "text-sm font-bold",
                                            row.under > 60 ? "text-green-600" : "text-navy-900"
                                        )}>
                                            {row.under.toFixed(1)}%
                                        </span>
                                        <div className="w-16 h-1 rounded-full bg-muted mt-1 overflow-hidden">
                                            <div
                                                className="h-full bg-navy-400 transition-all duration-1000"
                                                style={{ width: `${row.under}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Info */}
            <div className="p-4 bg-muted/20 border-t flex items-start gap-2">
                <Info className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-gray-500 font-medium leading-normal italic">
                    Les probabilités pour les corners sont calculées à partir des moyennes de tirs, de possession et de l'historique de chaque équipe.
                </p>
            </div>
        </div>
    )
}
