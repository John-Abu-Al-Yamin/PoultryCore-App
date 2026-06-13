import endPoints from "@/src/hooks/EndPoints/endPoints";
import queryKeys from "@/src/hooks/EndPoints/queryKeys";
import useDeleteData from "@/src/hooks/curdsHook/useDeleteData";
import useGetData from "@/src/hooks/curdsHook/useGetData";
import usePutData from "@/src/hooks/curdsHook/usePutData";
import usePostData from "@/src/hooks/curdsHook/usePostData";
import type { ApiResponse, Purchase, Supplier } from "@/src/types/api";

export const useGetAllPurchases = (page = 1, limit = 20) => {
  const { data, isPending, refetch, ...rest } = useGetData<
    ApiResponse<Purchase[]>
  >({
    url: endPoints.purchases,
    params: { page: String(page), limit: String(limit) },
    queryKeys: [queryKeys.purchases, String(page), String(limit)],
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

export const useGetPurchaseById = (id: string) => {
  const { data, isPending, refetch, ...rest } = useGetData<ApiResponse<Purchase>>({
    url: `${endPoints.purchases}/${id}`,
    params: { id },
    queryKeys: [queryKeys.purchases, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddPurchase = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.purchases,
    [queryKeys.addPurchases],
    [
      queryKeys.purchases, queryKeys.addPurchases, queryKeys.user,
      queryKeys.batches, queryKeys.suppliers, queryKeys.dashboard,
    ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeletePurchase = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.purchases,
    [queryKeys.deletePurchases],
    [
      queryKeys.purchases, queryKeys.deletePurchases,
      queryKeys.batches, queryKeys.suppliers, queryKeys.dashboard,
    ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdatePurchase = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    endPoints.purchases,
    [queryKeys.updatePurchases],
    [
      queryKeys.purchases, queryKeys.updatePurchases,
      queryKeys.batches, queryKeys.suppliers, queryKeys.dashboard,
    ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
