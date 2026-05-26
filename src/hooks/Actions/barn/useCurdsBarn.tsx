import endPoints from "@/src/hooks/EndPoints/endPoints";
import queryKeys from "@/src/hooks/EndPoints/queryKeys";
import useDeleteData from "@/src/hooks/curdsHook/useDeleteData";
import useGetData from "@/src/hooks/curdsHook/useGetData";
import usePutData from "@/src/hooks/curdsHook/usePutData";
import usePostData from "@/src/hooks/curdsHook/usePostData";

export const useGetAllBarns = (page = 1, limit = 20) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.barns,
    params: { page: String(page), limit: String(limit) },
    queryKeys: [queryKeys.barns, String(page), String(limit)],
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

export const useAddBarn = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.barns,
    [queryKeys.addBarns],
    [queryKeys.barns, queryKeys.addBarns ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteBarn = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.barns,
    [queryKeys.deleteBarns],
    [queryKeys.barns, queryKeys.deleteBarns ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateBarn = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    endPoints.barns,
    [queryKeys.updateBarns],
    [queryKeys.barns, queryKeys.updateBarns, ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
