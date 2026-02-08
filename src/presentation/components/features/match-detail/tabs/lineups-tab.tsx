"use client";

import type { MatchDetail, FixtureLineup, FixturePlayer } from "@/core/entities/match-detail/match-detail.entity";
import { cn } from "@/shared/utils";
import { Shirt, Users } from "lucide-react";

interface LineupsTabProps {
    match: MatchDetail;
}

export function LineupsTab({ match }: LineupsTabProps) {
    if (!match.lineups || match.lineups.length < 2) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900">Compositions non disponibles</p>
                <p className="text-xs text-gray-500 mt-1">
                    Les compositions d'équipe ne sont pas encore officialisées.
                </p>
            </div>
        );
    }

    const homeLineup = match.lineups.find(l => l.team.id === match.homeTeam.id) || match.lineups[0];
    const awayLineup = match.lineups.find(l => l.team.id === match.awayTeam.id) || match.lineups[1];

    return (
        <div className="space-y-8 p-4">
            {/* Formations Header */}
            <div className="flex justify-between items-center text-sm font-semibold text-gray-700 px-2">
                <span>{homeLineup.formation}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">Formation</span>
                <span>{awayLineup.formation}</span>
            </div>

            {/* Team Lists */}
            <div className="grid grid-cols-2 gap-4">
                {/* Home Team */}
                <div className="space-y-6">
                    {/* Start XI */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-1.5">
                            <Shirt className="w-3 h-3" /> Titulaires
                        </h4>
                        <ul className="space-y-3">
                            {homeLineup.startXI.map(p => (
                                <PlayerRow key={p.id} player={p} isHome={true} />
                            ))}
                        </ul>
                    </div>

                    {/* Subs */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 border-t pt-3">Remplaçants</h4>
                        <ul className="space-y-2">
                            {homeLineup.substitutes.map(p => (
                                <PlayerRow key={p.id} player={p} isHome={true} isSub={true} />
                            ))}
                        </ul>
                    </div>

                    {homeLineup.coach && (
                        <div className="pt-4 border-t text-xs">
                            <span className="font-bold text-gray-500">Entraîneur: </span>
                            <span className="text-navy font-semibold">{homeLineup.coach.name}</span>
                        </div>
                    )}
                </div>

                {/* Away Team */}
                <div className="space-y-6 text-right">
                    {/* Start XI */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center justify-end gap-1.5">
                            Titulaires <Shirt className="w-3 h-3" />
                        </h4>
                        <ul className="space-y-3">
                            {awayLineup.startXI.map(p => (
                                <PlayerRow key={p.id} player={p} isHome={false} />
                            ))}
                        </ul>
                    </div>

                    {/* Subs */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 border-t pt-3">Remplaçants</h4>
                        <ul className="space-y-2">
                            {awayLineup.substitutes.map(p => (
                                <PlayerRow key={p.id} player={p} isHome={false} isSub={true} />
                            ))}
                        </ul>
                    </div>

                    {awayLineup.coach && (
                        <div className="pt-4 border-t text-xs">
                            <span className="font-bold text-gray-500">Entraîneur: </span>
                            <span className="text-navy font-semibold">{awayLineup.coach.name}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function PlayerRow({ player, isHome, isSub = false }: { player: FixturePlayer; isHome: boolean; isSub?: boolean }) {
    return (
        <li className={cn(
            "flex items-center gap-2 text-sm",
            isHome ? "flex-row" : "flex-row-reverse"
        )}>
            <span className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold tabular-nums shadow-sm border",
                isHome
                    ? "bg-white border-gray-200 text-gray-700"
                    : "bg-navy text-white border-navy"
            )}>
                {player.number}
            </span>
            <span className={cn(
                "truncate font-medium",
                isSub ? "text-gray-500" : "text-gray-900"
            )}>
                {player.name}
            </span>
            {player.pos && !isSub && <span className="text-[9px] font-mono text-gray-300 ml-auto">{player.pos}</span>}
        </li>
    );
}
