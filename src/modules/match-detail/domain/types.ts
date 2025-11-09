import type { Match } from "@/modules/fixtures/domain/types";
import type { PredictionData } from "@/modules/predictions/domain/types";
import type { ProbabilitiesResponse } from "./probabilities-types";

export interface MatchDetail extends Match {
  venue?: string;
  referee?: string;
  predictions?: PredictionData[];
  probabilities?: ProbabilitiesResponse;
}
