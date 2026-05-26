import type { ReactNode } from "react";
import { View, TextInput, type TextInputProps } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import FormError from "./FormError";

interface AppInputProps extends Omit<TextInputProps, "placeholderTextColor"> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
  containerClassName?: string;
}

export default function AppInput({
  leftIcon,
  rightIcon,
  error,
  containerClassName = "",
  className = "",
  style,
  ...props
}: AppInputProps) {
  const { colors } = useTheme();

  return (
    <View className={containerClassName}>
      <View className="relative">
        {leftIcon && (
          <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
            {leftIcon}
          </View>
        )}
        <TextInput
          className={`bg-background-light dark:bg-background-dark border text-text-light dark:text-text-dark rounded-xl py-3.5 text-base ${
            error
              ? "border-error-light dark:border-error-dark"
              : "border-border-light dark:border-border-dark"
          } ${leftIcon ? "pl-11" : "pl-4"} ${rightIcon ? "pr-12" : "pr-4"} ${className}`}
          placeholderTextColor={colors.mutedForeground}
          style={style}
          {...props}
        />
        {rightIcon && (
          <View className="absolute right-3 top-0 bottom-0 justify-center">
            {rightIcon}
          </View>
        )}
      </View>
      <FormError message={error} />
    </View>
  );
}
