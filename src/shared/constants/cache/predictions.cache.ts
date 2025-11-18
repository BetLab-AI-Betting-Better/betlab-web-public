import { cacheProfiles } from "@/shared/constants/cache/policies";

export const PREDICTIONS_CACHE = {
  tags: {
    byFixture: (fixtureId?: number) =>
      typeof fixtureId === "number" ? `predictions:${fixtureId}` : "predictions",
  },
  life: {
    default: cacheProfiles.predictions,
  },
} as const;
