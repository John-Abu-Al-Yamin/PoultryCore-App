import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "@/src/services/toast";
import putRequest from "../handleRequest/PutRequest";
import type { MutationVariables } from "@/src/types";
import axios from "axios";

const usePutData = (
  url: string,
  mutationKeys: string[],
  invalidateQueryKey: string | string[]
) => {
  const queryClient = useQueryClient();
  const [requestData, setRequestData] = useState<Record<string, unknown> | null>(null);
  const [toastId, setToastId] = useState<string | null>(null);

  const mutation = useMutation({
    mutationKey: mutationKeys,

    mutationFn: async ({ data, url: overrideUrl }: MutationVariables) => {
      setRequestData(data ?? null);
      const finalUrl = overrideUrl || url;

      const id = toast.loading("جاري المعالجة...");
      setToastId(id);

      return putRequest(finalUrl, data);
    },

    onSuccess: (data, variables: MutationVariables) => {
      const { disableSuccessToast, onSuccess: callOnSuccess } = variables;

      if (toastId) {
        toast.dismiss(toastId);
        setToastId(null);
      }

      const invalidateKeys = Array.isArray(invalidateQueryKey)
        ? invalidateQueryKey
        : [invalidateQueryKey];

      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === key,
        });
      });

      if (!disableSuccessToast) {
        const successMessage = (data?.data as Record<string, unknown>)?.message as string || "Success!";
        toast.success(successMessage, { duration: 2000 });
      }

      if (typeof callOnSuccess === "function") {
        callOnSuccess(data);
      }
    },

    onError: (error: unknown, variables: MutationVariables) => {
      const { disableErrorToast, onError: callOnError } = variables;

      if (toastId) {
        toast.dismiss(toastId);
        setToastId(null);
      }

      if (!disableErrorToast) {
        const errorData = axios.isAxiosError(error)
          ? error.response?.data
          : null;

        if (errorData?.message) {
          if (typeof errorData.message === "object") {
            Object.entries(errorData.message).forEach(([_field, msg]) => {
              toast.error(msg as string, { duration: 3000 });
            });
          } else if (typeof errorData.message === "string") {
            toast.error(errorData.message, { duration: 3000 });
          }
        } else {
          toast.error("حدث خطأ غير متوقع", { duration: 3000 });
        }
      }

      if (typeof callOnError === "function") {
        callOnError(error);
      }
    },
  });

  return {
    requestData,
    ...mutation,
  };
};

export default usePutData;
