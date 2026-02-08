"use client";

import type { MatchDetail, FixtureStatistic } from "@/core/entities/match-detail/match-detail.entity";
import { cn } from "@/shared/utils";
import { BarChart, Minus } from "lucide-react";

interface StatsTabProps {
  match: MatchDetail;
}

export function StatsTab({ match }: StatsTabProps) {
  if (!match.statistics || match.statistics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <BarChart className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-900">Aucune statistique disponible</p>
        <p className="text-xs text-gray-500 mt-1">
          Les statistiques du match ne sont pas encore disponibles.
        </p>
      </div>
    );
  }

  // Filter out irrelevant stats (like generated IDs or empty ones)
  const validStats = match.statistics.filter(s =>
    s.value.home !== null && s.value.away !== null
  );

  return (
    <div className="space-y-6 pt-4 px-4 pb-20">
      {validStats.map((stat, idx) => {
        const homeVal = parseStatValue(stat.value.home);
        const awayVal = parseStatValue(stat.value.away);
        const total = homeVal + awayVal;

        const homePercent = total > 0 ? (homeVal / total) * 100 : 50;
        const awayPercent = total > 0 ? (awayVal / total) * 100 : 50;

        // Highlight the leader
        const homeLeading = homeVal > awayVal;
        const awayLeading = awayVal > homeVal;

        return (
          <div key={`${stat.type}-${idx}`} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs px-1">
              <span className={cn("font-medium tabular-nums", homeLeading ? "text-navy font-bold" : "text-gray-500")}>
                {stat.value.home}
              </span>
              <span className="text-gray-400 font-medium uppercase text-[10px] tracking-wide">{stat.type}</span>
              <span className={cn("font-medium tabular-nums", awayLeading ? "text-navy font-bold" : "text-gray-500")}>
                {stat.value.away}
              </span>
            </div>

            <div className="flex h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn("h-full transition-all duration-500", homeLeading ? "bg-navy" : "bg-gray-400")}
                style={{ width: `${homePercent}%` }}
              />
              <div className="w-0.5 bg-white h-full" />
              <div
                className={cn("h-full transition-all duration-500", awayLeading ? "bg-error" : "bg-gray-300")}
                style={{ width: `${awayPercent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function parseStatValue(val: string | number | null): number {
  if (val === null) return 0;
  if (typeof val === "number") return val;
  if (val.includes("%")) return parseFloat(val.replace("%", ""));
  return parseFloat(val) || 0;
}
