import type { Match } from "@/core/entities/fixtures/fixture.entity";
import type { PredictionData } from "@/core/entities/predictions/prediction.entity";
import type { ProbabilitiesResponse } from "./probabilities.entity";

export interface MatchDetail extends Match {
  venue?: string;
  referee?: string;
  predictions?: PredictionData[];
  probabilities?: ProbabilitiesResponse;
}
