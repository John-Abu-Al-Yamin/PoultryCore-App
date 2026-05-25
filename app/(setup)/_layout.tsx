import { useEffect, useState } from "react";
import { Stack, Redirect } from "expo-router";
import { checkAuthToken } from "@/src/services/cookies";
import { useTheme } from "@/src/contexts/ThemeContext";

export default function SetupLayout() {
  const { colors } = useTheme();
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    checkAuthToken().then((hasToken) => {
      setAuthState(hasToken ? "authenticated" : "unauthenticated");
    });
  }, []);

  if (authState === "unauthenticated") return <Redirect href="/(auth)/login" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}