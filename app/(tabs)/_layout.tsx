import { Tabs, router } from "expo-router";
import { useAuthGuard } from "@/src/hooks/useAuthGuard";
import React, { useEffect } from "react";
import { TABS } from "@/src/constants/tabs";
import FloatingTabBar from "@/src/components/custom/FloatingTabBar";

export default function TabsLayout() {
  const { isLoading, isAuthenticated, hasCompletedSetup } = useAuthGuard();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    } else if (!hasCompletedSetup) {
      router.replace("/(setup)/barn");
    }
  }, [isLoading, isAuthenticated, hasCompletedSetup]);

  if (isLoading) return null;
  if (!isAuthenticated || !hasCompletedSetup) return null;

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      {TABS?.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} />
      ))}
    </Tabs>
  );
}
