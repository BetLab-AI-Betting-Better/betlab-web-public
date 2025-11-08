export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface HttpRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  headers?: Record<string, string>;
  searchParams?: Record<string, string | number | boolean | undefined>;
  body?: TBody;
  cache?: RequestCache;
}

export interface HttpResponse<TData = unknown> {
  ok: boolean;
  status: number;
  data: TData;
}

export interface HttpClient {
  request<TResponse, TBody = unknown>(
    path: string,
    options?: HttpRequestOptions<TBody>
  ): Promise<HttpResponse<TResponse>>;
}
