import endPoints from "@/src/hooks/EndPoints/endPoints";
import queryKeys from "@/src/hooks/EndPoints/queryKeys";
import useDeleteData from "@/src/hooks/curdsHook/useDeleteData";
import useGetData from "@/src/hooks/curdsHook/useGetData";
import usePutData from "@/src/hooks/curdsHook/usePutData";
import usePostData from "@/src/hooks/curdsHook/usePostData";
import type { ApiResponse, Death } from "@/src/types/api";

export const useGetAllDeaths = (page = 1, limit = 20) => {
  const { data, isPending, refetch, ...rest } = useGetData<
    ApiResponse<Death[]>
  >({
    url: endPoints.deaths,
    params: { page: String(page), limit: String(limit) },
    queryKeys: [queryKeys.deaths, String(page), String(limit)],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
    page,
    limit,
  };
};

export const useGetDeathById = (id: string) => {
  const { data, isPending, refetch, ...rest } = useGetData<ApiResponse<Death>>({
    url: `${endPoints.deaths}/${id}`,
    params: { id },
    queryKeys: [queryKeys.deaths, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddDeath = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.deaths,
    [queryKeys.addDeaths],
    [queryKeys.deaths, queryKeys.addDeaths, queryKeys.user],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteDeath = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.deaths,
    [queryKeys.deleteDeaths],
    [queryKeys.deaths, queryKeys.deleteDeaths],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateDeath = (id: string) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    `${endPoints.deaths}/${id}`,
    [queryKeys.updateDeaths],
    [queryKeys.deaths, queryKeys.updateDeaths],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
