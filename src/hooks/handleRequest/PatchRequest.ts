import { request } from "@/src/services/clientService";
import type { RequestConfig } from "@/src/types";

const patchRequest = (url: string, data?: unknown, token?: string) => {
  const config: RequestConfig = { method: "PATCH", url, data };
  return request(config, token);
};

export default patchRequest;
