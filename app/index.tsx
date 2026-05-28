import { useTheme } from "@/src/contexts/ThemeContext";
import { removeAuthToken } from "@/src/services/cookies";
import { toast } from "@/src/services/toast";
import { router } from "expo-router";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import {getUser } from "@/src/services/cookies";
import { useEffect } from "react";
export default function Index () {
  const { theme, toggleTheme } = useTheme();

useEffect(() => {
  const loadUser = async () => {
    const user = await getUser();
    console.log("USER DATA", user);
  };

  loadUser();
}, []);
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background-light dark:bg-background-dark">
      <Text className="text-lg text-text-light dark:text-text-dark">
        Current theme: {theme}
      </Text>

      <Pressable
        onPress={toggleTheme}
        className="rounded-lg bg-primary-light px-6 py-3 dark:bg-primary-dark"
      >
        <Text className="font-semibold text-white">Toggle Theme</Text>
      </Pressable>

      <TouchableOpacity
        onPress={async () => {
          await removeAuthToken();
          router.replace("/(auth)/login");
        }}
        className="rounded-lg bg-primary-light px-6 py-3 dark:bg-primary-dark"
      >
        <Text className="font-semibold text-white">Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => toast.success("تم اضافه العنبر بنجاح")}
        className="rounded-lg bg-secondary-light px-6 py-3 dark:bg-secondary-dark"
      >
        <Text className="text-sm text-text-light dark:text-text-dark">
          Show Toastj
        </Text>
      </TouchableOpacity>
    </View>
  );
}
