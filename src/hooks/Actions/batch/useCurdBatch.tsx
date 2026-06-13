import endPoints from "@/src/hooks/EndPoints/endPoints";
import queryKeys from "@/src/hooks/EndPoints/queryKeys";
import useDeleteData from "@/src/hooks/curdsHook/useDeleteData";
import useGetData from "@/src/hooks/curdsHook/useGetData";
import usePutData from "@/src/hooks/curdsHook/usePutData";
import usePostData from "@/src/hooks/curdsHook/usePostData";
import type { ApiPaginatedResponse, ApiResponse, Batch, BatchCosts, Pagination } from "@/src/types/api";

export const useGetAllBatches = (page = 1, limit = 20) => {
  const { data, isPending, refetch, ...rest } = useGetData<
    ApiPaginatedResponse<Batch[]>
  >({
    url: endPoints.batches,
    params: { page: String(page), limit: String(limit) },
    queryKeys: [queryKeys.batches, String(page), String(limit)],
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

export const useGetBatchById = (id: string) => {
  const { data, isPending, refetch, ...rest } = useGetData<ApiResponse<Batch>>({
    url: `${endPoints.batches}/${id}`,
    params: { id },
    queryKeys: [queryKeys.batches, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddBatch = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.batches,
    [queryKeys.addBatches],
    [queryKeys.batches, queryKeys.addBatches, queryKeys.user, queryKeys.barns],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteBatch = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.batches,
    [queryKeys.deleteBatches],
    [queryKeys.batches, queryKeys.deleteBatches, queryKeys.barns, queryKeys.dashboard],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateBatch = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    endPoints.batches,
    [queryKeys.updateBatches],
    [queryKeys.batches, queryKeys.updateBatches, queryKeys.barns, queryKeys.dashboard],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useBatchClose = (id: string) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    `${endPoints.batches}/${id}/close`,
    [queryKeys.updateBatches],
    [queryKeys.batches, queryKeys.updateBatches, queryKeys.barns, queryKeys.dashboard],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
export const useBatchOpen = (id: string) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    `${endPoints.batches}/${id}/open`,
    [queryKeys.updateBatches],
    [queryKeys.batches, queryKeys.updateBatches, queryKeys.barns, queryKeys.dashboard],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};



export const useBatchCosts = (id: string) => {
  const { data, isPending, refetch, ...rest } = useGetData<ApiResponse<BatchCosts>>({
    url: `${endPoints.batches}/${id}/costs`,
    params: { id },
    queryKeys: [queryKeys.batches, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};