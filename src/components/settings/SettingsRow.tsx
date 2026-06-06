import type { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import AppText from "@/src/components/custom/AppText";

interface SettingsRowProps {
  icon: ReactNode;
  label: string;
  description?: string;
  onPress?: () => void;
  rightAction?: ReactNode;
  destructive?: boolean;
}

export default function SettingsRow({
  icon,
  label,
  description,
  onPress,
  rightAction,
  destructive,
}: SettingsRowProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress && !rightAction}
      activeOpacity={onPress ? 0.6 : 1}
      className="flex-row items-center py-3.5 px-4"
    >
      <View
        className={`w-10 h-10 rounded-xl items-center justify-center border ${
          destructive
            ? "bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/50"
            : "bg-muted-light dark:bg-muted-dark border-border-light dark:border-border-dark"
        }`}
      >
        {icon}
      </View>

      <View className="flex-1 mx-3">
        <AppText
          className={`font-semibold ${destructive ? "text-red-500" : ""}`}
        >
          {label}
        </AppText>
        {description && (
          <AppText variant="caption" muted className="mt-0.5">
            {description}
          </AppText>
        )}
      </View>

      {onPress && !rightAction && (
        <ChevronLeft size={18} color={colors.mutedForeground} />
      )}
      {rightAction}
    </TouchableOpacity>
  );
}
