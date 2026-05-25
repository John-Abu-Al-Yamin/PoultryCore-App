import { useEffect, useState } from "react";
import { Text, View, Pressable, TouchableOpacity, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useTheme } from "@/src/contexts/ThemeContext";
import { toast } from "@/src/services/toast";
import { checkAuthToken, getUser } from "@/src/services/cookies";

type AuthState = "loading" | "authenticated" | "unauthenticated";

export default function Index() {
  const { theme, toggleTheme } = useTheme();
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [setupDone, setSetupDone] = useState(false);

  useEffect(() => {
    (async () => {
      const hasToken = await checkAuthToken();
      if (!hasToken) {
        setAuthState("unauthenticated");
        return;
      }
      setAuthState("authenticated");
      const user = await getUser();
      setSetupDone(user?.has_completed_setup ?? false);
    })();
  }, []);

  if (authState === "unauthenticated") return <Redirect href="/(auth)/register" />;

  if (authState === "authenticated" && !setupDone) return <Redirect href="/(setup)/barn" />;

  if (authState === "loading") {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background-light dark:bg-background-dark">

      <Text className="text-lg text-text-light dark:text-text-dark">
        Current theme: {theme}
      </Text>
      <Pressable
        onPress={toggleTheme}
        className="rounded-lg bg-primary-light px-6 py-3 dark:bg-primary-dark"
      >
        <Text className="font-semibold text-white">
          Toggle Theme
        </Text>
      </Pressable>
      <TouchableOpacity
        onPress={() => toast.success("تم اضافه  العتبر ب نجاح")}
        className="rounded-lg bg-secondary-light px-6 py-3 dark:bg-secondary-dark"
      >
        <Text className="text-sm text-text-light dark:text-text-dark">
          Show Toast
        </Text>
      </TouchableOpacity>
    </View>
  );
}
