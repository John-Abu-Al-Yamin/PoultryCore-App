import endPoints from "@/src/hooks/EndPoints/endPoints";
import queryKeys from "@/src/hooks/EndPoints/queryKeys";
import useDeleteData from "@/src/hooks/curdsHook/useDeleteData";
import useGetData from "@/src/hooks/curdsHook/useGetData";
import usePutData from "@/src/hooks/curdsHook/usePutData";
import usePostData from "@/src/hooks/curdsHook/usePostData";
import type { ApiPaginatedResponse, Payment, Pagination, ApiResponse } from "@/src/types/api";

export const useGetAllPayments = (page = 1, limit = 20) => {
  const { data, isPending, refetch, ...rest } = useGetData<
    ApiPaginatedResponse<Payment[]>
  >({
    url: endPoints.payments,
    params: { page: String(page), limit: String(limit) },
    queryKeys: [queryKeys.payments, String(page), String(limit)],
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

export const useGetPaymentById = (id: string) => {
  const { data, isPending, refetch, ...rest } = useGetData<ApiResponse<Payment>>({
    url: `${endPoints.payments}/${id}`,
    params: { id },
    queryKeys: [queryKeys.payments, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddPayment = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.payments,
    [queryKeys.addPayments],
    [
      queryKeys.payments, queryKeys.addPayments, queryKeys.user,
      queryKeys.purchases, queryKeys.sales,
      queryKeys.suppliers, queryKeys.customers,
      queryKeys.dashboard,
    ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeletePayment = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.payments,
    [queryKeys.deletePayments],
    [
      queryKeys.payments, queryKeys.deletePayments,
      queryKeys.purchases, queryKeys.sales,
      queryKeys.suppliers, queryKeys.customers,
      queryKeys.dashboard,
    ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdatePayment = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    endPoints.payments,
    [queryKeys.updatePayments],
    [
      queryKeys.payments, queryKeys.updatePayments,
      queryKeys.purchases, queryKeys.sales,
      queryKeys.suppliers, queryKeys.customers,
      queryKeys.dashboard,
    ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
