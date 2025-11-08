/**
 * Execute promises in batches with concurrency limit
 * Prevents overwhelming external APIs with too many simultaneous requests
 *
 * @param items - Array of items to process
 * @param fn - Async function to execute for each item
 * @param concurrency - Maximum number of concurrent promises (default: 5)
 * @returns Promise that resolves to array of settled results
 *
 * @example
 * ```ts
 * const results = await promiseBatch(
 *   fixtureIds,
 *   (id) => getPrediction(id, 'match_result'),
 *   5 // max 5 concurrent requests
 * );
 * ```
 */
export async function promiseBatch<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency = 5
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = [];

  // Process items in batches
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map((item) => fn(item))
    );
    results.push(...batchResults);
  }

  return results;
}
