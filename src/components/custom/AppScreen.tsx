import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import Constants from "expo-constants";
import type { ReactNode } from "react";

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
  const inner = scrollable ? (
    <ScrollView
      contentContainerClassName={`flex-grow ${contentContainerClassName}`}
      keyboardShouldPersistTaps="handled"
      className={className}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${className}`}>{children}</View>
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
