import endPoints from "@/src/hooks/EndPoints/endPoints";
import queryKeys from "@/src/hooks/EndPoints/queryKeys";
import useDeleteData from "@/src/hooks/curdsHook/useDeleteData";
import useGetData from "@/src/hooks/curdsHook/useGetData";
import usePutData from "@/src/hooks/curdsHook/usePutData";
import usePostData from "@/src/hooks/curdsHook/usePostData";
import type { ApiPaginatedResponse, Supplier, Pagination, ApiResponse } from "@/src/types/api";

export const useGetAllSuppliers = (page = 1, limit = 20) => {
  const { data, isPending, refetch, ...rest } = useGetData<
    ApiPaginatedResponse<Supplier[]>
  >({
    url: endPoints.suppliers,
    params: { page: String(page), limit: String(limit) },
    queryKeys: [queryKeys.suppliers, String(page), String(limit)],
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

export const useGetSupplierById = (id: string) => {
  const { data, isPending, refetch, ...rest } = useGetData<ApiResponse<Supplier>>({
    url: `${endPoints.suppliers}/${id}`,
    params: { id },
    queryKeys: [queryKeys.suppliers, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddSupplier = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.suppliers,
    [queryKeys.addSuppliers],
    [queryKeys.suppliers, queryKeys.addSuppliers, queryKeys.user, queryKeys.dashboard],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteSupplier = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.suppliers,
    [queryKeys.deleteSuppliers],
    [queryKeys.suppliers, queryKeys.deleteSuppliers, queryKeys.dashboard],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateSupplier = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    endPoints.suppliers,
    [queryKeys.updateSuppliers],
    [queryKeys.suppliers, queryKeys.updateSuppliers, queryKeys.dashboard],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
