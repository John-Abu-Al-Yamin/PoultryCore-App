import axios from "axios";
import type { RequestConfig } from "../types/api";
import getAuthToken from "./cookies";

const clientApi = axios.create({
  // baseURL: "http://192.168.100.8:8000/api",
  baseURL: "https://poultrycore-api-production.up.railway.app/api",
});

export const request = async <T = unknown>(
  options: RequestConfig,
  tokenOverride?: string,
) => {
  const token = tokenOverride ?? (await getAuthToken());

  try {
    const res = await clientApi.request<T>({
      ...options,
      headers: {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error("Unexpected error");
  }
};
