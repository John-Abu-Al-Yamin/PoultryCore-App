import { useAuthGuard } from "@/src/hooks/useAuthGuard";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const { isLoading, isAuthenticated, hasCompletedSetup } = useAuthGuard();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    } else if (!hasCompletedSetup) {
      router.replace("/(setup)/barn");
    } else {
      router.replace("/(tabs)/home");
    }
  }, [isLoading, isAuthenticated, hasCompletedSetup]);

  return null;
}
