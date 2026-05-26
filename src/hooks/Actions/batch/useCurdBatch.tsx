import endPoints from "@/src/hooks/EndPoints/endPoints";
import queryKeys from "@/src/hooks/EndPoints/queryKeys";
import useDeleteData from "@/src/hooks/curdsHook/useDeleteData";
import useGetData from "@/src/hooks/curdsHook/useGetData";
import usePutData from "@/src/hooks/curdsHook/usePutData";
import usePostData from "@/src/hooks/curdsHook/usePostData";

export const useGetAllBatches = (page = 1, limit = 20) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.batches,
    params: { page: String(page), limit: String(limit) },
    queryKeys: [queryKeys.batches, String(page), String(limit)],
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

export const useAddBatch = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.batches,
    [queryKeys.addBatches],
    [queryKeys.batches, queryKeys.addBatches, queryKeys.user],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteBatch = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.batches,
    [queryKeys.deleteBatches],
    [queryKeys.batches, queryKeys.deleteBatches ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateBatch = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    endPoints.batches,
    [queryKeys.updateBatches],
    [queryKeys.batches, queryKeys.updateBatches, ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
