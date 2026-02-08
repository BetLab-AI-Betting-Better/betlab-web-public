"use client";

import { Check, X, Minus } from "lucide-react";
import type { HeadToHead, MatchDetail } from "@/core/entities/match-detail/match-detail.entity";
import { cn } from "@/shared/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface H2HTabProps {
    match: MatchDetail;
}

export function H2HTab({ match }: H2HTabProps) {
    if (!match.h2h || match.h2h.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Minus className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900">Aucun historique disponible</p>
                <p className="text-xs text-gray-500 mt-1">
                    Les deux équipes ne se sont jamais affrontées récemment.
                </p>
            </div>
        );
    }

    // Calculate summary stats
    const homeWins = match.h2h.filter(m => {
        if (!m.score) return false;
        const isHome = m.homeTeam.id === match.homeTeam.id;
        return isHome ? m.score.home > m.score.away : m.score.away > m.score.home;
    }).length;

    const awayWins = match.h2h.filter(m => {
        if (!m.score) return false;
        const isAway = m.awayTeam.id === match.awayTeam.id; // Correct logic: team B wins if it is away team and away score > home score OR if it is home team and home score > away score
        // Simpler: team B wins if (B is home & home>away) OR (B is away & away>home)
        const teamBId = match.awayTeam.id;
        if (m.homeTeam.id === teamBId) return m.score.home > m.score.away;
        if (m.awayTeam.id === teamBId) return m.score.away > m.score.home;
        return false;
    }).length;

    const draws = match.h2h.filter(m => m.score && m.score.home === m.score.away).length;

    return (
        <div className="space-y-6 p-4">
            {/* Summary Card */}
            <div className="bg-surface-elevated rounded-xl border border-border p-4 shadow-sm">
                <h3 className="text-sm font-semibold mb-4 text-center">5 Dernières Confrontations</h3>
                <div className="flex items-center justify-between px-4">
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-success">{homeWins}</span>
                        <span className="text-[10px] uppercase text-muted-foreground font-medium">{match.homeTeam.name}</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-gray-400">{draws}</span>
                        <span className="text-[10px] uppercase text-muted-foreground font-medium">Nuls</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-error">{awayWins}</span>
                        <span className="text-[10px] uppercase text-muted-foreground font-medium">{match.awayTeam.name}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 flex h-2 rounded-full overflow-hidden">
                    <div style={{ width: `${(homeWins / match.h2h.length) * 100}%` }} className="bg-success" />
                    <div style={{ width: `${(draws / match.h2h.length) * 100}%` }} className="bg-gray-300" />
                    <div style={{ width: `${(awayWins / match.h2h.length) * 100}%` }} className="bg-error" />
                </div>
            </div>

            {/* Match List */}
            <div className="space-y-3">
                {match.h2h.map((h) => {
                    const isHome = h.homeTeam.id === match.homeTeam.id;
                    const result = !h.score ? "pending" :
                        h.score.home === h.score.away ? "draw" :
                            (isHome && h.score.home > h.score.away) || (!isHome && h.score.away > h.score.home) ? "win" : "loss";

                    return (
                        <div key={h.id} className="bg-white rounded-lg border border-gray-100 p-3 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-xs text-gray-500 w-20">
                                {format(new Date(h.kickoffTime), "dd/MM/yy")}
                            </div>

                            <div className="flex-1 flex items-center justify-between px-2">
                                <span className={cn("flex-1 text-right truncate", h.homeTeam.id === match.homeTeam.id ? "font-bold text-navy" : "")}>
                                    {h.homeTeam.name}
                                </span>
                                <div className="mx-3 px-2 py-0.5 bg-gray-50 rounded text-xs font-bold tabular-nums">
                                    {h.score ? `${h.score.home} - ${h.score.away}` : "v"}
                                </div>
                                <span className={cn("flex-1 text-left truncate", h.awayTeam.id === match.awayTeam.id ? "font-bold text-navy" : "")}>
                                    {h.awayTeam.name}
                                </span>
                            </div>

                            <div className="w-6 flex justify-end">
                                {result === "win" && <span className="w-5 h-5 rounded-full bg-success/10 text-success flex items-center justify-center text-[10px] font-bold">V</span>}
                                {result === "draw" && <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold">N</span>}
                                {result === "loss" && <span className="w-5 h-5 rounded-full bg-error/10 text-error flex items-center justify-center text-[10px] font-bold">D</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
