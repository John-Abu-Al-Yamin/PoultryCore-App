import { Stack, router } from "expo-router";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useAuthGuard } from "@/src/hooks/useAuthGuard";
import { useEffect } from "react";

export default function AuthLayout() {
  const { colors } = useTheme();
  const { isLoading, isAuthenticated, hasCompletedSetup } = useAuthGuard();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      router.replace(hasCompletedSetup ? "/(tabs)/home" : "/(setup)/barn");
    }
  }, [isLoading, isAuthenticated, hasCompletedSetup]);

  if (isLoading) return null;
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
