import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import Constants from "expo-constants";
import type { ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AppScreenProps {
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
  contentContainerClassName?: string;
}

export default function AppScreen({
  children,
  className = "",
  scrollable = true,
  contentContainerClassName = "",
}: AppScreenProps) {
  const insets = useSafeAreaInsets();
  // Add enough padding to clear the floating tab bar (approx 85-90px)
  const bottomPadding = scrollable ? insets.bottom + 90 : 0;

  const inner = scrollable ? (
    <ScrollView
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      contentContainerClassName={`flex-grow ${contentContainerClassName}`}
      keyboardShouldPersistTaps="handled"
      className={className}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${className}`} style={{ paddingBottom: bottomPadding }}>{children}</View>
  );

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? Constants.statusBarHeight : 0}
      className="flex-1"
    >
      {inner}
    </KeyboardAvoidingView>
  );
}
