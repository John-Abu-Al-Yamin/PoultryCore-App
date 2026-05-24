import { request } from "@/src/services/clientService";
import type { RequestConfig } from "@/src/types";

const postRequest = (url: string, data?: unknown, token?: string) => {
  const config: RequestConfig = { method: "POST", url, data };
  return request(config, token);
};

export default postRequest;
