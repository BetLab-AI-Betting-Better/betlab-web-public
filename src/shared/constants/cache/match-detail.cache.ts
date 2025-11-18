import { cacheProfiles } from "@/shared/constants/cache/policies";

export const MATCH_DETAIL_CACHE = {
  tags: {
    byFixture: (fixtureId: number) => `match-detail:${fixtureId}`,
  },
  life: {
    detail: cacheProfiles.matchDetail,
  },
} as const;
