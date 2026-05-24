import { request } from "@/src/services/clientService";
import type { RequestConfig } from "@/src/types";

const deleteRequest = (url: string, token?: string) => {
  const config: RequestConfig = { method: "DELETE", url };
  return request(config, token);
};

export default deleteRequest;
