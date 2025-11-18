import type {
  PredictionData,
  PredictionType,
} from "@/core/entities/predictions/prediction.entity";

export interface IPredictionRepository {
  getPrediction(fixtureId: number, type: PredictionType): Promise<PredictionData | null>;
  getPredictions(fixtureIds: number[], type: PredictionType): Promise<PredictionData[]>;
}
