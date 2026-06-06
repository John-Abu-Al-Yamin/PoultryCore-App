import endPoints from "@/src/hooks/EndPoints/endPoints";
import queryKeys from "@/src/hooks/EndPoints/queryKeys";
import useDeleteData from "@/src/hooks/curdsHook/useDeleteData";
import useGetData from "@/src/hooks/curdsHook/useGetData";
import usePutData from "@/src/hooks/curdsHook/usePutData";
import usePostData from "@/src/hooks/curdsHook/usePostData";
import { User } from "@/src/types/user";




/* Main Units*/


export const useGetDashboard = (page = 1, limit = 20) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.dashboard,
    params: { page, limit },
    queryKeys: [queryKeys.dashboard, page, limit],
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
export const useGetAllUsers = (page = 1, limit = 20) => {
  const { data, isPending, refetch, ...rest } = useGetData({
    url: endPoints.users,
    params: { page, limit },
    queryKeys: [queryKeys.users, page, limit],
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


export const useGetMe = () => {
  const { data, isPending, refetch, ...rest } = useGetData<User>({
    url: endPoints.user,
    queryKeys: [queryKeys.user],
  });

  return {
    data,
    isPending,
    isError: rest.error,
    refetch,
  };
};

export const useAddUser = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.users,
    [queryKeys.addUsers],
    [queryKeys.users, queryKeys.addUsers, queryKeys.profile]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useDeleteUser = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = useDeleteData(
    endPoints.users,
    [queryKeys.deleteUsers],
    [queryKeys.users, queryKeys.deleteUsers, queryKeys.profile]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};

export const useUpdateUser = () => {
  const { mutate, data, error, isPending, isSuccess, isError } = usePutData(
    endPoints.users,
    [queryKeys.updateUsers],
    [queryKeys.users, queryKeys.updateUsers, queryKeys.profile]
  );

  return { mutate, data, error, isPending, isSuccess, isError };
};


