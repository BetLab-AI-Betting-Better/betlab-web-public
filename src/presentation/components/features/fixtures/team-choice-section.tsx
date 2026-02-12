"use client"

import React, { useMemo } from "react"
import { Star, TrendingUp, ChevronRight } from "lucide-react"
import { cn } from "@/shared/utils"
import { MatchCardVM, formatBestMarketPercent } from "@/application/view-models/fixtures/match-card.vm"
import NextLink from "next/link"

interface TeamChoiceSectionProps {
    matches: MatchCardVM[]
}

export function TeamChoiceSection({ matches }: TeamChoiceSectionProps) {
    const topPicks = useMemo(() => {
        return matches
            .filter((m) => m.bestMarket && m.status === "scheduled")
            .sort((a, b) => (b.bestMarket?.prob ?? 0) - (a.bestMarket?.prob ?? 0))
            .slice(0, 2)
    }, [matches])

    if (topPicks.length === 0) return null

    return (
        <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <div className="p-1 px-2 rounded-md bg-lime text-navy-950 text-[10px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(184,204,58,0.2)]">
                        Exclusif
                    </div>
                    <h2 className="text-[14px] font-extrabold text-navy-900 uppercase tracking-tight flex items-center gap-1.5 dark:text-navy-100">
                        <Star className="w-4 h-4 fill-lime text-lime animate-pulse" />
                        Choix de l'équipe
                    </h2>
                </div>
                <div className="text-[11px] text-gray-400 font-medium tabular-nums">Top {topPicks.length} du jour</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {topPicks.map((match) => (
                    <NextLink
                        key={match.id}
                        href={`/match/${match.id}`}
                        className={cn(
                            "group relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white shadow-sm transition-all duration-300",
                            "hover:shadow-lg hover:border-lime/30 hover:translate-y-[-2px]",
                            "dark:bg-navy-900 dark:border-navy-800"
                        )}
                    >
                        {/* Background Gradient Accent */}
                        <div className="absolute inset-0 bg-gradient-to-br from-lime/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative p-4 flex flex-col h-full">
                            {/* League header */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center p-1 dark:bg-navy-950">
                                        <img src={match.league.logo} alt="" className="w-full h-full object-contain" />
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest truncate max-w-[120px] dark:text-gray-400">
                                        {match.league.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/5 text-success text-[11px] font-bold border border-success/10">
                                    <TrendingUp className="w-3 h-3" />
                                    {formatBestMarketPercent(match.bestMarket?.prob)}
                                </div>
                            </div>

                            {/* Teams */}
                            <div className="flex items-center gap-4 mb-5">
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <img src={match.home.logo} alt="" className="w-6 h-6 object-contain" />
                                        <span className="text-sm font-black text-navy-950 truncate leading-none dark:text-white">
                                            {match.home.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <img src={match.away.logo} alt="" className="w-6 h-6 object-contain" />
                                        <span className="text-sm font-black text-navy-950 truncate leading-none dark:text-white">
                                            {match.away.name}
                                        </span>
                                    </div>
                                </div>

                                {/* Prediction Bubble */}
                                <div className="flex flex-col items-center justify-center min-w-[90px] px-3 py-3 rounded-2xl bg-navy-950 text-white shadow-xl ring-1 ring-white/10">
                                    <span className="text-[9px] font-black text-lime uppercase tracking-widest mb-1 opacity-80">Prono</span>
                                    <span className="text-[13px] font-black uppercase text-center leading-[1.1] text-balance">
                                        {match.bestMarket?.label}
                                    </span>
                                </div>
                            </div>

                            {/* Footer action */}
                            <div className="mt-auto pt-3 border-t border-gray-100/80 flex items-center justify-between dark:border-navy-800">
                                <span className="text-[10px] text-gray-400 font-semibold italic flex items-center gap-1.5 dark:text-gray-500">
                                    <div className="w-1 h-1 rounded-full bg-lime animate-pulse" />
                                    Analyse détaillée incluse
                                </span>
                                <span className="flex items-center gap-1 text-[11px] font-black text-navy-900 group-hover:text-lime transition-colors dark:text-navy-100">
                                    ANALYSER <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                                </span>
                            </div>
                        </div>
                    </NextLink>
                ))}
            </div>
        </div>
    )
}
