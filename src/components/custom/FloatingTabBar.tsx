import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet, Platform, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/src/contexts/ThemeContext";
import { TABS } from "@/src/constants/tabs";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TAB_ICON_SIZE = 22;
const ACTIVE_CIRCLE_SIZE = 38;

function TabItem({
  tab,
  isFocused,
  onPress,
  onLongPress,
  colors,
  theme,
}: {
  tab: (typeof TABS)[number];
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  colors: ReturnType<typeof useTheme>["colors"];
  theme: "light" | "dark";
}) {
  const IconComponent = tab.icon;

  const scale = useRef(new Animated.Value(isFocused ? 1 : 0.88)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isFocused ? 1 : 0.88,
      damping: 16,
      stiffness: 260,
      useNativeDriver: true,
    }).start();
  }, [isFocused, scale]);

  const animatedStyle = {
    transform: [{ scale }],
  };

  const isDark = theme === "dark";
  const activeBg = isDark ? "#FFFFFF" : "#000000";
  const activeFg = isDark ? "#000000" : "#FFFFFF";

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabItem}
    >
      <Animated.View style={[styles.tabContent, animatedStyle]}>
        <View
          style={[
            isFocused ? styles.activeCircle : styles.inactiveIconWrapper,
            isFocused && { backgroundColor: activeBg },
          ]}
        >
          <IconComponent
            size={TAB_ICON_SIZE}
            color={isFocused ? activeFg : colors.mutedForeground}
            strokeWidth={isFocused ? 2.5 : 2}
          />
        </View>
        <Text
          style={[
            styles.label,
            {
              color: isFocused
                ? isDark
                  ? "#FFFFFF"
                  : "#000000"
                : isDark
                  ? "#CFCFCF"
                  : "#333333",
              opacity: isFocused ? 1 : 0.85,
              fontWeight: isFocused ? "700" : "500",
            },
          ]}
          numberOfLines={1}
        >
          {tab.title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export default function FloatingTabBar({
  state,
  navigation,
}: BottomTabBarProps) {
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}
      pointerEvents="box-none"
    >
      <View style={[styles.tabBar, { backgroundColor: colors.card }]}>
        {TABS.map((tab, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: state.routes[index].key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(tab.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: state.routes[index].key,
            });
          };

          return (
            <TabItem
              key={tab.name}
              tab={tab}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              colors={colors}
              theme={theme}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 0,
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "space-evenly",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  activeCircle: {
    width: ACTIVE_CIRCLE_SIZE,
    height: ACTIVE_CIRCLE_SIZE,
    borderRadius: ACTIVE_CIRCLE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  inactiveIconWrapper: {
    width: ACTIVE_CIRCLE_SIZE,
    height: ACTIVE_CIRCLE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
  },
});
