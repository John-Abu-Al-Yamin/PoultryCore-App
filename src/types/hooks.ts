import type { RequestConfig } from "./api";

export interface UseGetDataOptions {
  url?: string;
  queryKeys?: string[];
  enabled?: boolean | (() => boolean);
  params?: Record<string, unknown>;
  other?: Partial<RequestConfig>;
}
