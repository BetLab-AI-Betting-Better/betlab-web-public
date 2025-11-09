/**
 * Type augmentation for Next.js 16 cache APIs
 * These types are for experimental cache features that may not be fully typed in stable releases
 */

declare module 'next/cache' {
  /**
   * Cache lifetime configuration object
   */
  export type CacheLifeConfig = {
    stale?: number
    revalidate?: number
    expire?: number
  }

  /**
   * Sets a cache lifetime profile for the current cache scope
   * @param profile - Cache lifetime profile name or configuration object
   */
  export function cacheLife(profile: string | CacheLifeConfig): void

  /**
   * Adds a cache tag to the current cache scope for invalidation
   * @param tag - Cache tag string or tag generator function result
   */
  export function cacheTag(tag: string | ReturnType<typeof cacheTag>): string

  // Re-export existing types
  export { revalidateTag, revalidatePath, unstable_cache, updateTag } from 'next/dist/server/web/spec-extension/revalidate'
}
