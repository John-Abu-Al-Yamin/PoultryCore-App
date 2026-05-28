import { Stack, router } from "expo-router";
import { useAuthGuard } from "@/src/hooks/useAuthGuard";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

export default function TabsLayout() {
  const { isLoading, isAuthenticated, hasCompletedSetup } = useAuthGuard();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    } else if (!hasCompletedSetup) {
      router.replace("/(setup)/barn");
    }
  }, [isLoading, isAuthenticated, hasCompletedSetup]);

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark"
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated || !hasCompletedSetup) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
