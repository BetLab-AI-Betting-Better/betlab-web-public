import { USER_CACHE } from "@/shared/constants/cache/user";

export const AUTH_CACHE = {
  tags: {
    profile: USER_CACHE.tags.profile,
  },
  life: {
    profile: USER_CACHE.life.profile,
  },
} as const;
