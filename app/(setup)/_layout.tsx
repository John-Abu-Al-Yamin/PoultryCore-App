import { Stack, router } from "expo-router";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAuthGuard } from "@/src/hooks/useAuthGuard";
import { useEffect } from "react";

export default function SetupLayout() {
  const { colors } = useTheme();
  const { isLoading, isAuthenticated, hasCompletedSetup } = useAuthGuard();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    } else if (hasCompletedSetup) {
      router.replace("/(tabs)/home");
    }
  }, [isLoading, isAuthenticated, hasCompletedSetup]);

  if (isLoading) return null;
  if (!isAuthenticated || hasCompletedSetup) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
