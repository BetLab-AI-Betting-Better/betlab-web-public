import { HomeFixturesClient } from "./home-fixtures.client";
import type { PredictionType } from "@/core/entities/predictions/prediction.entity";
import { container } from "@/presentation/di/container";

interface HomeFixturesSectionProps {
  asOf?: Date;
  predictionType?: PredictionType;
}

export async function HomeFixturesSection({
  asOf,
  predictionType,
}: HomeFixturesSectionProps = {}) {
  const fixturesService = container.createFixturesService();
  const matches = await fixturesService.getFixturesWithPredictions({
    date: asOf,
    predictionType,
  });
  return <HomeFixturesClient initialMatches={matches} />;
}
