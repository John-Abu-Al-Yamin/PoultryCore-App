import { View, Text, type ViewProps, type TextProps } from "react-native";

const cardShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.05,
  shadowRadius: 24,
  elevation: 4,
};

export function Card({ className = "", style, children, ...props }: ViewProps) {
  return (
    <View
      className={`bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-3xl ${className}`}
      style={[cardShadow, style]}
      {...props}
    >
      {children}
    </View>
  );
}

export function CardHeader({ className = "", style, children, ...props }: ViewProps) {
  return (
    <View
      className={`px-6 pt-6 pb-4 gap-y-1.5 ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}

export function CardContent({ className = "", style, children, ...props }: ViewProps) {
  return (
    <View
      className={`px-6 pb-6 ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}

export function CardFooter({ className = "", style, children, ...props }: ViewProps) {
  return (
    <View
      className={`px-6 pb-6 pt-4 gap-y-1.5 ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}

export function CardTitle({ className = "", style, children, ...props }: TextProps) {
  return (
    <Text
      className={`text-lg font-semibold text-text-light dark:text-text-dark ${className}`}
      style={[{ letterSpacing: -0.3 }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

export function CardDescription({ className = "", style, children, ...props }: TextProps) {
  return (
    <Text
      className={`text-sm text-mutedForeground-light dark:text-mutedForeground-dark leading-relaxed ${className}`}
      style={style}
      {...props}
    >
      {children}
    </Text>
  );
}
