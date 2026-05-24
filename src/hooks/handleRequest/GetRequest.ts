import { request } from "@/src/services/clientService";
import type { RequestConfig } from "@/src/types";

const getRequest = (url: string, token?: string, options?: Partial<RequestConfig>) => {
  const config: RequestConfig = { method: "GET", url, ...options };
  return request(config, token);
};

export default getRequest;
