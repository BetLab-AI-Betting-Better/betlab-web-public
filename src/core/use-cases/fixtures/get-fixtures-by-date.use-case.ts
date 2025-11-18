import type { Match } from "@/core/entities/fixtures/fixture.entity";
import type { IFixtureRepository } from "@/core/repositories/fixture.repository";

export class GetFixturesByDateUseCase {
  constructor(private readonly fixtureRepository: IFixtureRepository) {}

  async execute(date: string): Promise<Match[]> {
    return this.fixtureRepository.findByDate(date);
  }
}
