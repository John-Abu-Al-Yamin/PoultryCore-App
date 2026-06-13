import endPoints from "@/src/hooks/EndPoints/endPoints";
import queryKeys from "@/src/hooks/EndPoints/queryKeys";
import useDeleteData from "@/src/hooks/curdsHook/useDeleteData";
import useGetData from "@/src/hooks/curdsHook/useGetData";
import usePutData from "@/src/hooks/curdsHook/usePutData";
import usePostData from "@/src/hooks/curdsHook/usePostData";
import type { ApiPaginatedResponse, ApiResponse, Customer, Pagination } from "@/src/types/api";

export const useGetAllCustomers = (page = 1, limit = 20) => {
  const { data, isPending, refetch, ...rest } = useGetData<
    ApiPaginatedResponse<Customer[]>
  >({
    url: endPoints.customers,
    params: { page: String(page), limit: String(limit) },
    queryKeys: [queryKeys.customers, String(page), String(limit)],
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

export const useGetCustomerById = (id: string) => {
  const { data, isPending, refetch, ...rest } = useGetData<ApiResponse<Customer>>({
    url: `${endPoints.customers}/${id}`,
    params: { id },
    queryKeys: [queryKeys.customers, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddCustomer = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.customers,
    [queryKeys.addCustomers],
    [
      queryKeys.customers, queryKeys.addCustomers, queryKeys.user,
      queryKeys.barns, queryKeys.dashboard,
    ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteCustomer = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.customers,
    [queryKeys.deleteCustomers],
    [queryKeys.customers, queryKeys.deleteCustomers, queryKeys.dashboard],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateCustomer = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    endPoints.customers,
    [queryKeys.updateCustomers],
    [queryKeys.customers, queryKeys.updateCustomers, queryKeys.dashboard],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
