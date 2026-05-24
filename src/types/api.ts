import type { AxiosRequestConfig } from "axios";

export type RequestConfig = AxiosRequestConfig;

export interface MutationVariables {
  data?: Record<string, unknown>;
  url?: string;
  id?: string | number;
  disableSuccessToast?: boolean;
  disableErrorToast?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}

export interface MutationContext {
  loadingToastId?: string | number;
}
