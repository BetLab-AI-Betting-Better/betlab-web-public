import type { Match } from "@/core/entities/fixtures/fixture.entity";

export interface IFixtureRepository {
  findByDate(date: string): Promise<Match[]>;
  findLive(): Promise<Match[]>;
}
