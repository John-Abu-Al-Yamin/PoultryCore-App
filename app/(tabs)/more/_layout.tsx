import { View } from "react-native";
import { Stack } from "expo-router";

export default function MoreLayout() {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="barn" />
        <Stack.Screen name="customers" />
        <Stack.Screen name="suppliers" />
        <Stack.Screen name="settings" />
      </Stack>
    </View>
  );
}
