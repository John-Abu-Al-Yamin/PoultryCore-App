import React, { type ReactNode } from "react";
import { View } from "react-native";
import AppText from "@/src/components/custom/AppText";

interface SettingsSectionProps {
  title?: string;
  children: ReactNode;
}

export default function SettingsSection({
  title,
  children,
}: SettingsSectionProps) {
  const childrenArray = React.Children.toArray(children);

  return (
    <View className="mb-6">
      {title && (
        <AppText
          variant="label"
          muted
          className="px-4 mb-2 uppercase tracking-wider"
        >
          {title}
        </AppText>
      )}
      <View className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl overflow-hidden">
        {childrenArray.map((child, index) => (
          <React.Fragment key={index}>
            {child}
            {index < childrenArray.length - 1 && (
              <View className="h-[1px] bg-border-light/50 dark:bg-border-dark/50 mx-4" />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}
