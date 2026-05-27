import { Stack } from "expo-router";
import { useTheme } from "@/src/contexts/ThemeContext";

export default function SetupLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}