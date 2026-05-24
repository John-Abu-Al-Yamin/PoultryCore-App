import "../global.css";
import { useCallback } from "react";
import { View } from "react-native";
import {  Stack } from "expo-router";
import Toast from "react-native-toast-message";
import * as SplashScreen from "expo-splash-screen";

import { useFonts } from "@expo-google-fonts/tajawal";
import { ThemeProvider } from "@/src/contexts/ThemeContext";
import TanstackProvider from "@/src/providers/TanstackProvider";
import { toastConfig } from "@/src/components/ToastConfig";

import { fonts, setDefaultFont } from "@/src/config/fonts";
import { enableRTL } from "@/src/config/rtl";
import { initSplash } from "@/src/config/splash";


enableRTL();
setDefaultFont();
initSplash();

export default function RootLayout() {
  const [loaded, error] = useFonts(fonts);

  const onLayout = useCallback(async () => {
    if (loaded || error) {
      await SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      <TanstackProvider>
        <ThemeProvider>
          <Stack />
          <Toast config={toastConfig} />
        </ThemeProvider>
      </TanstackProvider>
    </View>
  );
}
