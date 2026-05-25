import axios from "axios";
import getAuthToken from "./cookies";
import type { RequestConfig } from "../types/api";

const clientApi = axios.create({
  baseURL: "http://192.168.100.8:8000/api",
});

export const request = async <T = unknown>(
  options: RequestConfig,
  tokenOverride?: string
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
