import endPoints from "@/src/hooks/EndPoints/endPoints";
import queryKeys from "@/src/hooks/EndPoints/queryKeys";
import useDeleteData from "@/src/hooks/curdsHook/useDeleteData";
import useGetData from "@/src/hooks/curdsHook/useGetData";
import usePutData from "@/src/hooks/curdsHook/usePutData";
import usePostData from "@/src/hooks/curdsHook/usePostData";
import type { ApiResponse, Sale } from "@/src/types/api";

export const useGetAllSales = (page = 1, limit = 20) => {
  const { data, isPending, refetch, ...rest } = useGetData<
    ApiResponse<Sale[]>
  >({
    url: endPoints.sales,
    params: { page: String(page), limit: String(limit) },
    queryKeys: [queryKeys.sales, String(page), String(limit)],
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

export const useGetSaleById = (id: string) => {
  const { data, isPending, refetch, ...rest } = useGetData<ApiResponse<Sale>>({
    url: `${endPoints.sales}/${id}`,
    params: { id },
    queryKeys: [queryKeys.sales, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddSale = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.sales,
    [queryKeys.addSales],
    [
      queryKeys.sales, queryKeys.addSales, queryKeys.user,
      queryKeys.batches, queryKeys.customers, queryKeys.dashboard,
    ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteSale = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.sales,
    [queryKeys.deleteSales],
    [
      queryKeys.sales, queryKeys.deleteSales,
      queryKeys.batches, queryKeys.customers, queryKeys.dashboard,
    ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateSale = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    endPoints.sales,
    [queryKeys.updateSales],
    [
      queryKeys.sales, queryKeys.updateSales,
      queryKeys.batches, queryKeys.customers, queryKeys.dashboard,
    ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
