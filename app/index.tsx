import { Text, View, Pressable, TouchableOpacity } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { toast } from "@/src/services/toast";

export default function Index() {
  const { theme, toggleTheme } = useTheme();

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background-light dark:bg-background-dark">

      <Text className="text-lg text-text-light dark:text-text-dark">
        Current theme: {theme}
      </Text>
      <Pressable
        onPress={toggleTheme}
        className="rounded-lg bg-primary-light px-6 py-3 dark:bg-primary-dark"
      >
        <Text className="font-semibold text-background-light dark:text-background-dark">
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
