import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
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
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const content = (
    <View className="items-center justify-center gap-4">
      <Animated.View
        style={animatedStyle}
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
