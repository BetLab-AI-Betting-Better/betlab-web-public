import type {
  Match,
  MatchWithPrediction,
} from "@/core/entities/fixtures/fixture.entity";
import type { PredictionType } from "@/core/entities/predictions/prediction.entity";
import type { IFixtureRepository } from "@/core/repositories/fixture.repository";
import type { IPredictionRepository } from "@/core/repositories/prediction.repository";
import { GetFixturesByDateUseCase } from "@/core/use-cases/fixtures/get-fixtures-by-date.use-case";
import { GetFixturesWithPredictionsUseCase } from "@/core/use-cases/fixtures/get-fixtures-with-predictions.use-case";

interface FixturesServiceDeps {
  fixtureRepository: IFixtureRepository;
  predictionRepository: IPredictionRepository;
}

export class FixturesService {
  private readonly getFixturesByDateUseCase: GetFixturesByDateUseCase;
  private readonly getFixturesWithPredictionsUseCase: GetFixturesWithPredictionsUseCase;

  constructor({ fixtureRepository, predictionRepository }: FixturesServiceDeps) {
    this.getFixturesByDateUseCase = new GetFixturesByDateUseCase(fixtureRepository);
    this.getFixturesWithPredictionsUseCase = new GetFixturesWithPredictionsUseCase(
      fixtureRepository,
      predictionRepository
    );
  }

  async getFixturesByDate(date: string): Promise<Match[]> {
    return this.getFixturesByDateUseCase.execute(date);
  }

  async getFixturesWithPredictions(options?: {
    date?: Date;
    predictionType?: PredictionType;
  }): Promise<MatchWithPrediction[]> {
    return this.getFixturesWithPredictionsUseCase.execute(options);
  }
}
