import { USER_CACHE } from "@/shared/constants/cache/user";

export const ONBOARDING_CACHE = {
  tags: {
    profile: USER_CACHE.tags.profile,
    onboarding: USER_CACHE.tags.onboarding,
  },
  life: {
    profile: USER_CACHE.life.profile,
    onboarding: USER_CACHE.life.onboarding,
  },
} as const;
