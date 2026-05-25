import { Text as RNText, type TextProps } from "react-native";

type AppTextVariant = "h1" | "h2" | "h3" | "body" | "bodySmall" | "label" | "caption" | "error";

interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
  muted?: boolean;
}

const variantClasses: Record<AppTextVariant, string> = {
  h1: "text-2xl font-bold",
  h2: "text-xl font-bold",
  h3: "text-lg font-bold",
  body: "text-base",
  bodySmall: "text-sm",
  label: "text-sm font-medium",
  caption: "text-xs",
  error: "text-sm",
};

const colorClass = "text-text-light dark:text-text-dark";
const errorColorClass = "text-error-light dark:text-error-dark";

export default function AppText({
  variant = "body",
  muted = false,
  className = "",
  style,
  children,
  ...props
}: AppTextProps) {
  const isError = variant === "error";
  const baseColor = isError ? errorColorClass : colorClass;

  return (
    <RNText
      className={`${variantClasses[variant]} ${baseColor} ${className}`}
      style={[muted && { opacity: 0.8 }, style]}
      {...props}
    >
      {children}
    </RNText>
  );
}
