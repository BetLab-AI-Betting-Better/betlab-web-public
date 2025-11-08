import "server-only";

import type { HttpClient, HttpRequestOptions, HttpResponse } from "@/core/http/client";
import { env } from "@/core/config/env";

function buildUrl(
  path: string,
  searchParams?: Record<string, string | number | boolean | undefined>
) {
  const url = new URL(path.replace(/^\//, ""), env.NEXT_PUBLIC_API_BASE_URL);
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

async function executeRequest<TResponse, TBody = unknown>(
  path: string,
  options: HttpRequestOptions<TBody> = {}
): Promise<HttpResponse<TResponse>> {
  const { method = "GET", headers, body, searchParams, cache } = options;
  const url = buildUrl(path, searchParams);

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: cache ?? (method === "GET" ? "force-cache" : undefined),
  });

  const data = (await response.json()) as TResponse;

  if (!response.ok) {
    const error = new Error(`BetLab API error ${response.status}: ${response.statusText}`) as Error & { status: number };
    error.status = response.status;
    // Only log errors for non-404/500 status codes
    // 404 are expected for missing predictions
    // 500 are backend issues that don't affect app functionality (handled by Promise.allSettled)
    if (response.status !== 404 && response.status !== 500) {
      console.error(error.message, data);
    }
    // No logging for 404/500 - they're handled gracefully by callers
    throw error;
  }

  return {
    ok: true,
    status: response.status,
    data,
  } satisfies HttpResponse<TResponse>;
}

export const betlabHttpClient: HttpClient = {
  async request<TResponse, TBody = unknown>(
    path: string,
    options?: HttpRequestOptions<TBody>
  ): Promise<HttpResponse<TResponse>> {
    return executeRequest<TResponse, TBody>(path, options);
  },
};

export async function betlabFetch<TResponse, TBody = unknown>(
  path: string,
  options?: HttpRequestOptions<TBody>
): Promise<TResponse> {
  const response = await betlabHttpClient.request<TResponse, TBody>(path, options);
  return response.data;
}
