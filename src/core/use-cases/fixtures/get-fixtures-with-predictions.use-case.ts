import type {
  Match,
  MatchWithPrediction,
} from "@/core/entities/fixtures/fixture.entity";
import type { IPredictionRepository } from "@/core/repositories/prediction.repository";
import type { IFixtureRepository } from "@/core/repositories/fixture.repository";
import type { PredictionType } from "@/core/entities/predictions/prediction.entity";
import { promiseBatch } from "@/shared/utils/promise-batch";

interface GetFixturesWithPredictionsInput {
  date?: Date;
  predictionType?: PredictionType;
}

export class GetFixturesWithPredictionsUseCase {
  constructor(
    private readonly fixtureRepository: IFixtureRepository,
    private readonly predictionRepository: IPredictionRepository
  ) {}

  async execute({
    date,
    predictionType = "match_result",
  }: GetFixturesWithPredictionsInput = {}): Promise<
    MatchWithPrediction[]
  > {
    const isoDate =
      date?.toISOString().split("T")[0] ?? new Date().toISOString().split("T")[0];

    const matches = await this.fixtureRepository.findByDate(isoDate);
    if (matches.length === 0) {
      return matches;
    }

    const results = await promiseBatch(
      matches,
      (match: Match) =>
        this.predictionRepository.getPrediction(match.fixtureId, predictionType),
      5
    );

    return matches.map((match, index) => {
      const result = results[index];
      return {
        ...match,
        prediction:
          result?.status === "fulfilled" ? result.value ?? undefined : undefined,
      };
    });
  }
}
