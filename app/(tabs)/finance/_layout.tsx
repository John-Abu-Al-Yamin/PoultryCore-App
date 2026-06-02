import { View } from "react-native";
import { Stack } from "expo-router";

export default function FinanceLayout() {
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
        <Stack.Screen name="expenses" />
        <Stack.Screen name="payments" />
        <Stack.Screen name="purchases" />
        <Stack.Screen name="sales" />
      </Stack>
    </View>
  );
}
