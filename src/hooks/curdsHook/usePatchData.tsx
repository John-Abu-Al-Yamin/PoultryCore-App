import { useAuthContext } from "@/src/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/src/services/toast";
import patchRequest from "../handleRequest/PatchRequest";
import type { MutationVariables, MutationContext } from "@/src/types";
import axios from "axios";

const usePatchData = (
  url: string,
  mutationKeys: string[],
  invalidateQueryKey: string | string[]
) => {
  const { token } = useAuthContext();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: mutationKeys,
    mutationFn: async ({ data, url: overrideUrl }: MutationVariables) => {
      const finalUrl = overrideUrl || url;
      return patchRequest(finalUrl, data, token ?? undefined);
    },
    onMutate: () => {
      const loadingToastId = toast.loading("جاري التعديل...");
      return { loadingToastId } satisfies MutationContext;
    },
    onSuccess: (
      data,
      _variables: MutationVariables,
      context?: MutationContext
    ) => {
      const successMessage = (data?.data as Record<string, unknown>)?.message as string || "تم التعديل بنجاح!";

      const invalidateKeys = Array.isArray(invalidateQueryKey)
        ? invalidateQueryKey
        : [invalidateQueryKey];

      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });

      toast.success(successMessage, { duration: 3000 });
    },
    onError: (
      error: unknown,
      _variables: MutationVariables,
      context?: MutationContext
    ) => {
      const errData = axios.isAxiosError(error) ? error.response?.data : null;
      const errors = errData?.errors;
      const message = errData?.message || "حدث خطأ ما";

      if (errors && typeof errors === "object") {
        for (const key in errors) {
          if (errors[key]) {
            toast.error(errors[key], { duration: 2000 });
          }
        }
        return;
      }

      toast.error(message, { duration: 5000 });
    },
  });

  return { ...mutation };
};

export default usePatchData;
