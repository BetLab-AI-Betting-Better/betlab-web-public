"use client"

import React from "react"
import { cn } from "@/shared/utils"
import { Layers, Info } from "lucide-react"
import type { AsianHandicapCardVM, AsianTotalsCardVM } from "@/application/view-models/match-detail/prediction-cards.vm"

interface HandicapCardProps {
    handicapVM?: AsianHandicapCardVM
    totalsVM?: AsianTotalsCardVM
}

export function HandicapCard({ handicapVM, totalsVM }: HandicapCardProps) {
    const isAvailable = handicapVM?.available || totalsVM?.available
    if (!isAvailable) return null

    return (
        <div className="grid grid-cols-1 gap-6 animation-scale-in">
            {handicapVM?.available && (
                <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-4 bg-[var(--navy)] border-b flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <Layers className="text-lime w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-white uppercase tracking-tight leading-none mb-1">
                                    Handicap Asiatique
                                </h3>
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider italic">
                                    Inclut le remboursement (Push)
                                </div>
                            </div>
                        </div>
                        {handicapVM.confidence && (
                            <div className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                handicapVM.confidence.className
                            )}>
                                {handicapVM.confidence.label}
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-black border-b text-center">
                                    <th className="p-4 text-left">Ligne</th>
                                    <th className="p-4">Domicile</th>
                                    <th className="p-4">Extérieur</th>
                                    <th className="p-4">Push</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-center">
                                {handicapVM.lines.map((l, idx) => (
                                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                        <td className="p-4 font-black text-navy-950 text-left">
                                            {l.line > 0 ? `+${l.line}` : l.line}
                                        </td>
                                        <td className="p-4 font-bold text-navy-800">
                                            {l.home.toFixed(1)}%
                                        </td>
                                        <td className="p-4 font-bold text-navy-800">
                                            {l.away.toFixed(1)}%
                                        </td>
                                        <td className="p-4 font-bold text-gray-400 italic">
                                            {l.push.toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {totalsVM?.available && (
                <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-4 bg-[var(--navy)] border-b flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                <Layers className="text-lime w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-white uppercase tracking-tight leading-none mb-1">
                                    Totaux Asiatiques
                                </h3>
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider italic">
                                    Buts (Over/Under avec Push)
                                </div>
                            </div>
                        </div>
                        {totalsVM.confidence && (
                            <div className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                totalsVM.confidence.className
                            )}>
                                {totalsVM.confidence.label}
                            </div>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-black border-b text-center">
                                    <th className="p-4 text-left">Ligne</th>
                                    <th className="p-4">Plus (Over)</th>
                                    <th className="p-4">Moins (Under)</th>
                                    <th className="p-4">Push</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-center">
                                {totalsVM.lines.map((l, idx) => (
                                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                        <td className="p-4 font-black text-navy-950 text-left">
                                            {l.line}
                                        </td>
                                        <td className="p-4 font-bold text-navy-800">
                                            {l.over.toFixed(1)}%
                                        </td>
                                        <td className="p-4 font-bold text-navy-800">
                                            {l.under.toFixed(1)}%
                                        </td>
                                        <td className="p-4 font-bold text-gray-400 italic">
                                            {l.push.toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="p-4 bg-muted/20 border rounded-2xl flex items-start gap-2">
                <Info className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-gray-500 font-medium leading-normal">
                    Les marchés asiatiques offrent une protection supplémentaire en remboursant la mise (Push) si le résultat exact correspond à la ligne choisie.
                </p>
            </div>
        </div>
    )
}
