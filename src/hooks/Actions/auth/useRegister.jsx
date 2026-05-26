import endPoints from "@/src/hooks/EndPoints/endPoints";
import queryKeys from "@/src/hooks/EndPoints/queryKeys";
import usePostData from "@/src/hooks/curdsHook/usePostData";
import { setAuthToken, setUser } from "@/src/services/cookies";

import { useEffect, useState } from "react";

const useRegister = () => {
  const [errorMsg, setErrorMsg] = useState(null);

  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.register,
    [queryKeys.register],
    [queryKeys.register],
  );

  useEffect(() => {
    if (isSuccess && data) {
      const apiToken = data?.data?.data?.token || data?.data?.token;

      if (typeof apiToken === "string" && apiToken.length > 0) {
        setAuthToken(apiToken);
      }

      if (data?.data?.data?.user) {
        setUser(data.data.data.user);
      }
    }

    if (isError && error) {
      const serverErr =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.message ||
        error?.message ||
        "Registration failed";
      setErrorMsg(serverErr);
    }
  }, [data, isSuccess, isError, error]);

  return {
    mutate,
    data,
    error,
    isPending,
    isSuccess,
    isError,
    errorMsg,
    setErrorMsg,
  };
};

export default useRegister;
