import { useQuery } from "@tanstack/react-query";
import getRequest from "../handleRequest/GetRequest";
import type { UseGetDataOptions } from "@/src/types";
import type { AxiosResponse } from "axios";

const useGetData = <T = unknown>({
  url = "",
  queryKeys = [],
  enabled = true,
  params = { page: 1, limit: 30 },
  other = {},
}: UseGetDataOptions = {}) => {
  const GetDataRequest = () =>
    getRequest<T>(url, undefined, { params: { ...params } });

  const responses = useQuery<AxiosResponse<T>>({
    queryKey: [...queryKeys, params.page, params.limit],
    queryFn: GetDataRequest,
    enabled: typeof enabled === "function" ? (enabled as () => boolean)() : !!enabled,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: false,
    ...other,
  });

  return { ...responses };
};

export default useGetData;
