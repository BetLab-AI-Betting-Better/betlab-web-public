import "server-only";
import { cache } from "react";
import { betlabFetch } from "@/infra/services/betlab-api/client";
import type { TeamStats } from "../domain/types";

interface ApiTeamStatsResponse {
  stats: {
    team_id: number;
    attack: number;
    defense: number;
    possession: number;
    passing: number;
    shots: number;
    discipline: number;
    avg_goals_scored: number;
    avg_goals_conceded: number;
    clean_sheets: number;
    recent_form: string[];
  };
}

function transformTeamStats(apiStats: ApiTeamStatsResponse["stats"]): TeamStats {
  return {
    teamId: apiStats.team_id,
    attack: apiStats.attack,
    defense: apiStats.defense,
    possession: apiStats.possession,
    passing: apiStats.passing,
    shots: apiStats.shots,
    discipline: apiStats.discipline,
    avgGoalsScored: apiStats.avg_goals_scored,
    avgGoalsConceded: apiStats.avg_goals_conceded,
    cleanSheets: apiStats.clean_sheets,
    form: apiStats.recent_form.map((result) =>
      result === "W" || result === "D" || result === "L" ? result : "D"
    ),
  };
}

export const getTeamStats = cache(async (teamId: number): Promise<TeamStats> => {
  const data = await betlabFetch<ApiTeamStatsResponse>(`/api/teams/${teamId}/stats`);
  return transformTeamStats(data.stats);
});
