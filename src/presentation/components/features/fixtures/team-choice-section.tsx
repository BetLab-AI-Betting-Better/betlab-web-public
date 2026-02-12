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
                    <div className="p-1 px-2.5 rounded-full bg-lime text-navy-950 text-[9px] font-black uppercase tracking-[0.1em] shadow-[0_2px_10px_rgba(184,204,58,0.3)] border border-white/20">
                        Exclusif
                    </div>
                    <h2 className="text-[13px] font-black text-navy-900 uppercase tracking-tight flex items-center gap-1.5 dark:text-white">
                        <Star className="w-3.5 h-3.5 fill-lime text-lime animate-pulse" />
                        Choix de l'équipe
                    </h2>
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest tabular-nums font-mono">Top Selection</div>
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
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[120px]">
                                        {match.league.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/5 text-success text-[10px] font-bold border border-success/10">
                                    <TrendingUp className="w-3 h-3" />
                                    {formatBestMarketPercent(match.bestMarket?.prob)}
                                </div>
                            </div>

                            {/* Teams */}
                            <div className="flex items-center gap-4 mb-3">
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <img src={match.home.logo} alt="" className="w-5 h-5 object-contain" />
                                        <span className="text-xs font-black text-navy-950 truncate leading-none dark:text-white">
                                            {match.home.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <img src={match.away.logo} alt="" className="w-5 h-5 object-contain" />
                                        <span className="text-xs font-black text-navy-950 truncate leading-none dark:text-white">
                                            {match.away.name}
                                        </span>
                                    </div>
                                </div>

                                {/* Prediction Bubble */}
                                <div className="flex flex-col items-center justify-center min-w-[90px] px-2 py-2 rounded-xl bg-lime-50 border border-lime-200/50 group-hover:bg-lime/20 dark:bg-lime-900/10 dark:border-lime-800/20 transition-colors">
                                    <span className="text-[8px] font-black text-lime-700 uppercase tracking-widest mb-0.5 dark:text-lime-400">
                                        Prono
                                    </span>
                                    <span className="text-[11px] font-black uppercase text-center leading-tight text-navy-950 dark:text-white text-balance">
                                        {match.bestMarket?.label}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </NextLink>
                ))}
            </div>
        </div>
    )
}
