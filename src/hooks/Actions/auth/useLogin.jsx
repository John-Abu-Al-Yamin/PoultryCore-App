import endPoints from "@/src/hooks/EndPoints/endPoints";
import queryKeys from "@/src/hooks/EndPoints/queryKeys";
import usePostData from "@/src/hooks/curdsHook/usePostData";
import { setAuthToken } from "@/src/services/cookies";

import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
const useLogin = () => {
  const [errorMsg, setErrorMsg] = useState(null);

const router = useRouter();

  const { mutate, data, error, isPending, isSuccess, isError } = usePostData(
    endPoints.login,
    [queryKeys.login],
    [queryKeys.login]
  );

  useEffect(() => {
    if (isSuccess && data) {
      // استخراج التوكن كسلسلة نصية من الاستجابة
      const apiToken = data?.data?.data?.token || data?.data?.token;

      console.log("login response", data?.data);
      console.log("apiToken", apiToken);

      if (typeof apiToken === "string" && apiToken.length > 0) {
        setAuthToken(apiToken);
      }
    }

    if (isError && error) {
      const serverErr =
        error?.response?.data?.errors?.[0] ||
        error?.response?.data?.message ||
        error?.message ||
        "Login failed";
      setErrorMsg(serverErr);
    }
  }, [data, isSuccess, isError, error, router]);

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

export default useLogin;
