import { Stack, router } from "expo-router";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAuthGuard } from "@/src/hooks/useAuthGuard";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

export default function AuthLayout() {
  const { colors } = useTheme();
  const { isLoading, isAuthenticated, hasCompletedSetup } = useAuthGuard();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      router.replace(hasCompletedSetup ? "/(tabs)/home" : "/(setup)/barn");
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

  if (isAuthenticated) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
