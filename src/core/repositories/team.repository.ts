import type { TeamStats } from "@/core/entities/teams/team.entity";

export interface ITeamRepository {
  getTeamStats(teamId: number): Promise<TeamStats>;
}
