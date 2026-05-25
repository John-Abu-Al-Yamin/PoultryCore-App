import {
  TouchableOpacity,
  ActivityIndicator,
  Text,
  type TouchableOpacityProps,
} from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";

type AppButtonVariant = "primary" | "secondary" | "outline";

interface AppButtonProps extends TouchableOpacityProps {
  loading?: boolean;
  variant?: AppButtonVariant;
}

const bgClasses: Record<AppButtonVariant, string> = {
  primary: "bg-primary-light dark:bg-primary-dark",
  secondary: "bg-secondary-light dark:bg-secondary-dark",
  outline: "border border-border-light dark:border-border-dark",
};

const fgClasses: Record<AppButtonVariant, string> = {
  primary: "text-background-light dark:text-background-dark",
  secondary: "text-text-light dark:text-text-dark",
  outline: "text-text-light dark:text-text-dark",
};

export default function AppButton({
  loading = false,
  variant = "primary",
  className = "",
  disabled,
  children,
  ...props
}: AppButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={`w-full rounded-xl py-3.5 items-center justify-center flex-row gap-2 ${bgClasses[variant]} ${isDisabled ? "opacity-50" : ""} ${className}`}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.background : colors.text}
        />
      ) : (
        <Text className={`text-base font-bold ${fgClasses[variant]}`}>
          {typeof children === "string" ? children : children}
        </Text>
      )}
    </TouchableOpacity>
  );
}
