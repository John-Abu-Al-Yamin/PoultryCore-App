import "../global.css";
import { useCallback } from "react";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

import { useFonts } from "@expo-google-fonts/tajawal";
import { ThemeProvider, useTheme } from "@/src/contexts/ThemeContext";
import TanstackProvider from "@/src/providers/TanstackProvider";
import { toastConfig } from "@/src/components/ToastConfig";

import { fonts, setDefaultFont } from "@/src/config/fonts";
import { enableRTL } from "@/src/config/rtl";
import { initSplash } from "@/src/config/splash";

enableRTL();
setDefaultFont();
initSplash();

function ThemeAwareStatusBar() {
  const { theme } = useTheme();
  return <StatusBar style={theme === "dark" ? "light" : "dark"} />;
}

function ThemedStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
      }}
    />
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts(fonts);

  const onLayout = useCallback(async () => {
    if (loaded || error) {
      await SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView
        className="bg-background-light dark:bg-background-dark"
        style={{ flex: 1 }}
        edges={["top", "bottom"]}
        onLayout={onLayout}
      >
        <TanstackProvider>
          <ThemeProvider>
            <ThemeAwareStatusBar />
            <ThemedStack />
            <Toast config={toastConfig} />
          </ThemeProvider>
        </TanstackProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
