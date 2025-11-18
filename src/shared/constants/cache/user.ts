import { cacheProfiles } from "./policies";

export const USER_CACHE = {
  tags: {
    profile: (userId: string) => `user:profile:${userId}`,
    onboarding: (userId: string) => `user:onboarding:${userId}`,
  },
  life: {
    profile: cacheProfiles.userPrivate,
    onboarding: cacheProfiles.userPrivate,
  },
} as const;
