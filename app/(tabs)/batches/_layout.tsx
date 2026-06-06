import { View } from "react-native";
import { Stack } from "expo-router";

export default function BatchesLayout() {
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
        <Stack.Screen name="add" />
        <Stack.Screen name="[id]" />
        <Stack.Screen name="edit/[id]" />
      </Stack>
    </View>
  );
}
