import { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import AppText from "./AppText";
import { Loader } from "lucide-react-native";

interface AppLoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export default function AppLoading({
  message = "جاري التحميل...",
  fullScreen = false,
}: AppLoadingProps) {
  const { colors } = useTheme();
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const content = (
    <View className="items-center justify-center gap-4">
      <Animated.View
        style={{ transform: [{ rotate: spin }] }}
        className="w-14 h-14 rounded-2xl items-center justify-center bg-secondary-light dark:bg-secondary-dark"
      >
        <Loader size={28} color={colors.text} />
      </Animated.View>
      <AppText variant="body" muted className="text-center">
        {message}
      </AppText>
    </View>
  );

  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark px-4">
        {content}
      </View>
    );
  }

  return content;
}
