import { View } from "react-native";
import { Stack, router } from "expo-router";
import { useAuthGuard } from "@/src/hooks/useAuthGuard";
import { useEffect } from "react";

export default function SetupLayout() {
  const { isLoading, isAuthenticated, hasCompletedSetup } = useAuthGuard();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    } else if (hasCompletedSetup) {
      router.replace("/(tabs)/home");
    }
  }, [isLoading, isAuthenticated, hasCompletedSetup]);

  if (isLoading || !isAuthenticated || hasCompletedSetup) {
    return (
      <View className="flex-1 bg-background-light dark:bg-background-dark" />
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
      }}
    />
  );
}
