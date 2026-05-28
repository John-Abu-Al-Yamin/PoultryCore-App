import { Link, router } from "expo-router";

import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { removeAuthToken } from "@/src/services/cookies";
import { Pressable, TouchableOpacity, View } from "react-native";

export default function Home() {
  const handleLogout = async () => {
    await removeAuthToken();
    router.replace("/(auth)/login");
  };
  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="items-center justify-center px-4 flex-1"
    >
      <View className="items-center">
        <AppText variant="h1">الرئيسية</AppText>
        <AppText variant="body" muted className="mt-2">
          مرحباً بك في التطبيق
        </AppText>
      </View>
    </AppScreen>
  );
}
