/**
 * Type augmentation for Next.js 16
 *
 * Update revalidateTag signature with cacheLife profiles introduced in Next.js 16.
 */

declare module 'next/cache' {
  /**
   * Revalidate cache entries associated with a specific tag
   * @param tag - The cache tag to revalidate
   * @param cacheLife - Optional cache profile or inline expiration config
   */
  export function revalidateTag(tag: string, cacheLife?: string | { expire: number }): void;

  /**
   * Update tagged data immediately and opt into read-your-writes semantics.
   */
  export function updateTag(tag: string): void;

  /**
   * Revalidate all cache entries for a specific path
   * @param path - The path to revalidate
   * @param type - Optional type ('page' or 'layout')
   */
  export function revalidatePath(path: string, type?: 'page' | 'layout'): void;
}
