import { request } from "@/src/services/clientService";
import type { RequestConfig } from "@/src/types";

const putRequest = (url: string, data?: unknown, token?: string) => {
  const config: RequestConfig = { method: "PUT", url, data };
  return request(config, token);
};

export default putRequest;
