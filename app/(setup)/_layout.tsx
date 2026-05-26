import { useState, useCallback } from "react";
import { Stack, Redirect, useFocusEffect } from "expo-router";
import { checkAuthToken, getUser } from "@/src/services/cookies";
import { useTheme } from "@/src/contexts/ThemeContext";

export default function SetupLayout() {
  const { colors } = useTheme();
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const [setupDone, setSetupDone] = useState<boolean | null>(null);

  useFocusEffect(
    useCallback(() => {
      checkAuthToken().then((hasToken) => {
        setAuthState(hasToken ? "authenticated" : "unauthenticated");
      });
      getUser().then((user) => {
        setSetupDone(user?.has_completed_setup ?? false);
      });
    }, []),
  );

  if (authState === "unauthenticated") return <Redirect href="/(auth)/login" />;

  if (authState === "authenticated" && setupDone === true) return <Redirect href="/" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}