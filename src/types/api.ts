import type { AxiosRequestConfig } from "axios";

export type RequestConfig = AxiosRequestConfig;

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

export interface Barn {
  id: number;
  user_id: number;
  name: string;
  location: string;
  capacity: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  batches?: Batch[];
}

export interface Batch {
  id: number;
  user_id: number;
  barn_id: number;
  poultry_type: string;
  current_quantity: number;
  start_date: string;
  end_date: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

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
