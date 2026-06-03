import { View, TouchableOpacity } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import AppText from "./AppText";
import { AlertCircle, RefreshCw, ArrowRight } from "lucide-react-native";

interface AppErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
  fullScreen?: boolean;
}

export default function AppError({
  title = "حدث خطأ",
  message = "تعذر تحميل البيانات. حاول مرة أخرى.",
  onRetry,
  onBack,
  fullScreen = false,
}: AppErrorProps) {
  const { colors } = useTheme();

  const content = (
    <View className="items-center justify-center gap-5 px-6">
      <View className="w-16 h-16 rounded-2xl items-center justify-center bg-error-light/10 dark:bg-error-dark/10">
        <AlertCircle size={32} color={colors.error} />
      </View>

      <View className="items-center gap-1">
        <AppText variant="h3" className="text-center">
          {title}
        </AppText>
        <AppText variant="body" muted className="text-center leading-6">
          {message}
        </AppText>
      </View>

      <View className="flex-row gap-3 mt-2">
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            className="flex-row items-center gap-2 px-6 py-3 rounded-xl border border-border-light dark:border-border-dark bg-secondary-light dark:bg-secondary-dark"
          >
            <ArrowRight size={18} color={colors.text} />
            <AppText variant="body">رجوع</AppText>
          </TouchableOpacity>
        )}

        {onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            activeOpacity={0.7}
            className="flex-row items-center gap-2 px-6 py-3 rounded-xl bg-primary-dark dark:bg-primary-light"
          >
            <RefreshCw size={18} color={colors.background} />
            <AppText
              variant="body"
              className="text-background-dark dark:text-background-light"
            >
              إعادة المحاولة
            </AppText>
          </TouchableOpacity>
        )}
      </View>
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
