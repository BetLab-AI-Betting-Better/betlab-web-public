"use client";

import type { MatchDetail, FixtureLineup, FixturePlayer, PlayerStats } from "@/core/entities/match-detail/match-detail.entity";
import { cn } from "@/shared/utils";
import { Shirt, Users, Shield, Zap, Target } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/presentation/components/ui/tooltip";
import { DevelopmentPlaceholder } from "@/presentation/components/ui/development-placeholder";

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

    const getPlayerStats = (playerId: number) => match.playersStats?.[playerId];

    return (
        <TooltipProvider>
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
                                    <PlayerRow key={p.id} player={p} stats={getPlayerStats(p.id)} isHome={true} />
                                ))}
                            </ul>
                        </div>

                        {/* Subs */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 border-t pt-3">Remplaçants</h4>
                            <ul className="space-y-2">
                                {homeLineup.substitutes.map(p => (
                                    <PlayerRow key={p.id} player={p} stats={getPlayerStats(p.id)} isHome={true} isSub={true} />
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
                                    <PlayerRow key={p.id} player={p} stats={getPlayerStats(p.id)} isHome={false} />
                                ))}
                            </ul>
                        </div>

                        {/* Subs */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 border-t pt-3">Remplaçants</h4>
                            <ul className="space-y-2">
                                {awayLineup.substitutes.map(p => (
                                    <PlayerRow key={p.id} player={p} stats={getPlayerStats(p.id)} isHome={false} isSub={true} />
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

                {/* Development Placeholders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <DevelopmentPlaceholder title="Météo du match" message="Les données météorologiques (température, vent) seront bientôt disponibles." />
                    <DevelopmentPlaceholder title="Stats Saisonnières" message="Les statistiques détaillées de la saison pour chaque équipe arrivent bientôt." />
                </div>
            </div>
        </TooltipProvider>
    );
}

function PlayerRow({ player, stats, isHome, isSub = false }: { player: FixturePlayer; stats?: PlayerStats; isHome: boolean; isSub?: boolean }) {

    const hasStats = !!stats;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <li className={cn(
                    "flex items-center gap-2 text-sm cursor-default hover:bg-gray-50 p-1 rounded transition-colors group",
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
                    <div className={cn("flex flex-col", !isHome && "items-end")}>
                        <span className={cn(
                            "truncate font-medium flex items-center gap-2",
                            isSub ? "text-gray-500" : "text-gray-900"
                        )}>
                            {player.name}
                            {stats?.rating && (
                                <span className={cn(
                                    "text-[9px] px-1 rounded border",
                                    Number(stats.rating) >= 7 ? "bg-green-50 text-green-700 border-green-200" :
                                        Number(stats.rating) >= 6 ? "bg-blue-50 text-blue-700 border-blue-200" :
                                            "bg-gray-50 text-gray-600 border-gray-200"
                                )}>
                                    {Number(stats.rating).toFixed(1)}
                                </span>
                            )}
                        </span>
                    </div>
                    {player.pos && !isSub && <span className="text-[9px] font-mono text-gray-300 ml-auto group-hover:text-gray-400">{player.pos}</span>}
                </li>
            </TooltipTrigger>
            {hasStats && stats && (
                <TooltipContent side={isHome ? "right" : "left"} className="w-48 p-3">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between border-b pb-1 mb-1">
                            <span className="font-bold text-xs">{player.name}</span>
                            <span className="text-[10px] text-muted-foreground">{stats.minutes} min</span>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Target className="w-3 h-3" /> xG
                                </span>
                                <span className="font-mono font-medium">
                                    {Number.isFinite(stats.xg) ? stats.xg.toFixed(2) : "--"}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Zap className="w-3 h-3" /> xA
                                </span>
                                <span className="font-mono font-medium">
                                    {Number.isFinite(stats.xa) ? stats.xa.toFixed(2) : "--"}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                    <Shield className="w-3 h-3" /> Tacles
                                </span>
                                <span className="font-mono font-medium">{stats.tackles}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground">Duels</span>
                                <span className="font-mono font-medium">{stats.duels_won}/{stats.duels_total}</span>
                            </div>
                        </div>
                    </div>
                </TooltipContent>
            )}
        </Tooltip>
    );
}
