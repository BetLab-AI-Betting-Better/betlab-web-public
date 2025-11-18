import type { MatchDetail } from "@/core/entities/match-detail/match-detail.entity";

export interface IMatchDetailRepository {
  getMatchDetail(fixtureId: number): Promise<MatchDetail>;
  getLiveMatchDetail(fixtureId: number): Promise<MatchDetail>;
}
