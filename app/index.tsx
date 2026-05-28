import { useAuthGuard } from "@/src/hooks/useAuthGuard";
import { router } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

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

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}
