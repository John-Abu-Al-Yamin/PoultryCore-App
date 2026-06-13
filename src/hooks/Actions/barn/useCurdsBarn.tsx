import endPoints from "@/src/hooks/EndPoints/endPoints";
import queryKeys from "@/src/hooks/EndPoints/queryKeys";
import useDeleteData from "@/src/hooks/curdsHook/useDeleteData";
import useGetData from "@/src/hooks/curdsHook/useGetData";
import usePutData from "@/src/hooks/curdsHook/usePutData";
import usePostData from "@/src/hooks/curdsHook/usePostData";
import type { ApiPaginatedResponse, ApiResponse, Barn, BarnListItem, Pagination } from "@/src/types/api";

export const useGetAllBarns = (page = 1, limit = 20) => {
  const { data, isPending, refetch, ...rest } = useGetData<
    ApiPaginatedResponse<BarnListItem[]>
  >({
    url: endPoints.barns,
    params: { page: String(page), limit: String(limit) },
    queryKeys: [queryKeys.barns, String(page), String(limit)],
    other: { placeholderData: (prev: unknown) => prev },
  });

  const pagination: Pagination | undefined = data?.data?.pagination;

  return {
    data,
    isPending,
    isFetching: rest.isFetching,
    isError: rest.error,
    refetch,
    page,
    limit,
    pagination,
  };
};

export const useGetBarnById = (id: string) => {
  const { data, isPending, refetch, ...rest } = useGetData<ApiResponse<Barn>>({
    url: `${endPoints.barns}/${id}`,
    params: {
      id,
    },

    queryKeys: [queryKeys.barns, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddBarn = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.barns,
    [queryKeys.addBarns],
    [queryKeys.barns, queryKeys.addBarns, queryKeys.dashboard],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateBarn = (id: string) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    `${endPoints.barns}/${id}`,
    [queryKeys.barns, id],
    [queryKeys.barns, queryKeys.dashboard],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteBarn = (id: string) => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.barns,
    [queryKeys.deleteBarns],
    [queryKeys.barns, queryKeys.deleteBarns, queryKeys.dashboard],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
