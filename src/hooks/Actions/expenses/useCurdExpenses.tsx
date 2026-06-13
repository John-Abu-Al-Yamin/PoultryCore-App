import endPoints from "@/src/hooks/EndPoints/endPoints";
import queryKeys from "@/src/hooks/EndPoints/queryKeys";
import useDeleteData from "@/src/hooks/curdsHook/useDeleteData";
import useGetData from "@/src/hooks/curdsHook/useGetData";
import usePutData from "@/src/hooks/curdsHook/usePutData";
import usePostData from "@/src/hooks/curdsHook/usePostData";
import type { ApiResponse, Expense } from "@/src/types/api";

export const useGetAllExpenses = (page = 1, limit = 20) => {
  const { data, isPending, refetch, ...rest } = useGetData<
    ApiResponse<Expense[]>
  >({
    url: endPoints.expenses,
    params: { page: String(page), limit: String(limit) },
    queryKeys: [queryKeys.expenses, String(page), String(limit)],
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

export const useGetExpenseById = (id: string) => {
  const { data, isPending, refetch, ...rest } = useGetData<ApiResponse<Expense>>({
    url: `${endPoints.expenses}/${id}`,
    params: { id },
    queryKeys: [queryKeys.expenses, id],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddExpense = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.expenses,
    [queryKeys.addExpenses],
    [
      queryKeys.expenses, queryKeys.addExpenses, queryKeys.user,
      queryKeys.batches, queryKeys.dashboard,
    ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteExpense = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.expenses,
    [queryKeys.deleteExpenses],
    [
      queryKeys.expenses, queryKeys.deleteExpenses,
      queryKeys.batches, queryKeys.dashboard,
    ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateExpense = (id: string) => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    `${endPoints.expenses}/${id}`,
    [queryKeys.updateExpenses],
    [
      queryKeys.expenses, queryKeys.updateExpenses,
      queryKeys.batches, queryKeys.dashboard,
    ],
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};
