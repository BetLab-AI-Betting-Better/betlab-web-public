export type CacheLifeConfig = {
  stale?: number;
  revalidate?: number;
  expire?: number;
};

export const cacheProfiles = {
  liveBurst: {
    stale: 15,
    revalidate: 30,
    expire: 120,
  },
  fixturesShort: {
    stale: 120,
    revalidate: 300,
    expire: 1800,
  },
  predictions: {
    stale: 300,
    revalidate: 900,
    expire: 3600,
  },
  matchDetail: {
    stale: 120,
    revalidate: 600,
    expire: 1800,
  },
  metadata: {
    stale: 3600,
    revalidate: 7200,
    expire: 86400,
  },
  userPrivate: {
    stale: 0,
    revalidate: 0,
    expire: 60,
  },
} as const satisfies Record<string, CacheLifeConfig>;

export type CacheProfileName = keyof typeof cacheProfiles;
