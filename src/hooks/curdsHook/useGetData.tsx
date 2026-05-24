import { useQuery } from "@tanstack/react-query";
import getRequest from "../handleRequest/GetRequest";
import type { UseGetDataOptions } from "@/src/types";

const useGetData = ({
  url = "",
  queryKeys = [],
  enabled = true,
  params = { page: 1, limit: 30 },
  other = {},
}: UseGetDataOptions = {}) => {
  const GetDataRequest = () =>
    getRequest(url, undefined, { params: { ...params } });

  const responses = useQuery({
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
