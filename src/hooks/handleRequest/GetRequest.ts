import { request } from "@/src/services/clientService";
import type { RequestConfig } from "@/src/types";

const getRequest = <T = unknown>(url: string, token?: string, options?: Partial<RequestConfig>) => {
  const config: RequestConfig = { method: "GET", url, ...options };
  return request<T>(config, token);
};

export default getRequest;
