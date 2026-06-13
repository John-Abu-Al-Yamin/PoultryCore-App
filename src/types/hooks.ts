export interface UseGetDataOptions {
  url?: string;
  queryKeys?: string[];
  enabled?: boolean | (() => boolean);
  params?: Record<string, unknown>;
  other?: Record<string, unknown>;
}
