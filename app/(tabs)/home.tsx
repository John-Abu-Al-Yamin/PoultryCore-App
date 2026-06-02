import { router } from "expo-router";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { TouchableOpacity, View } from "react-native";
import { removeAuthToken } from "@/src/services/cookies";

export default function Home() {
  const handleLogout = () => {
    removeAuthToken();
    router.replace("/login");
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
      <TouchableOpacity
        onPress={handleLogout}
        className="mt-6 bg-red-500 px-4 py-2 rounded"
      >
        <AppText variant="body" >
          تسجيل الخروج
        </AppText>
      </TouchableOpacity>
    </AppScreen>
  );
}
