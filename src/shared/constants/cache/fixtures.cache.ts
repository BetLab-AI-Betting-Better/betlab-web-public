import { cacheProfiles } from "@/shared/constants/cache/policies";

export const FIXTURES_CACHE = {
  tags: {
    byDate: (date?: string) => (date ? `fixtures:${date}` : "fixtures"),
    live: () => "fixtures:live",
  },
  life: {
    byDate: cacheProfiles.fixturesShort,
    live: cacheProfiles.liveBurst,
  },
} as const;
