import { Text as RNText, type TextProps } from "react-native";

type AppTextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "bodySmall"
  | "label"
  | "caption"
  | "error";

interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
  muted?: boolean;
  inverse?: boolean; // 👈 for cards (white in light / black in dark)
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

// default text (normal app text)
const defaultColorClass =
  "text-text-light dark:text-text-dark";

// error text
const errorColorClass =
  "text-error-light dark:text-error-dark";

// inverse text (for cards as you requested)
const inverseColorClass =
  "text-white dark:text-black";

export default function AppText({
  variant = "body",
  muted = false,
  inverse = false,
  className = "",
  style,
  children,
  ...props
}: AppTextProps) {
  const isError = variant === "error";

  const baseColor = isError
    ? errorColorClass
    : inverse
    ? inverseColorClass
    : defaultColorClass;

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