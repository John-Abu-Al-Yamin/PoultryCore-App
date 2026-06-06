import { useState, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { ChevronDown } from "lucide-react-native";
import AppText from "./AppText";
import { useTheme } from "@/src/contexts/ThemeContext";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FaqAccordionProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export default function FaqAccordion({
  question,
  answer,
  defaultOpen = false,
}: FaqAccordionProps) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(defaultOpen);

  const toggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  }, []);

  return (
    <View className="overflow-hidden">
      <TouchableOpacity
        activeOpacity={0.6}
        className="flex-row items-center justify-between px-4 py-4"
        onPress={toggle}
      >
        <AppText className="flex-1 ml-2 font-semibold">{question}</AppText>
        <View
          className="transition-transform"
          style={{
            transform: [{ rotate: expanded ? "180deg" : "0deg" }],
          }}
        >
          <ChevronDown
            size={18}
            color={theme === "dark" ? "#FFFFFF" : "#000000"}
          />
        </View>
      </TouchableOpacity>
      {expanded && (
        <View className="px-4 pb-4">
          <AppText variant="bodySmall" muted className="leading-5">
            {answer}
          </AppText>
        </View>
      )}
    </View>
  );
}
