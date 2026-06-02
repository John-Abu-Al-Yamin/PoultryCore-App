import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { Warehouse, Users, Truck, Settings } from "lucide-react-native";

const LINKS = [
  { href: "/(tabs)/more/barn", title: "العنبر", icon: Warehouse, description: "إدارة العنابر والمخازن" },
  { href: "/(tabs)/more/customers", title: "العملاء", icon: Users, description: "إدارة العملاء والمبيعات" },
  { href: "/(tabs)/more/suppliers", title: "الموردين", icon: Truck, description: "إدارة الموردين والمشتريات" },
  { href: "/(tabs)/more/settings", title: "الإعدادات", icon: Settings, description: "إعدادات التطبيق" },
] as const;

export default function MoreScreen() {
  const { colors } = useTheme();

  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="px-4 pt-20"
    >
      <AppText variant="h1" className="text-center mb-1">
        المزيد
      </AppText>
      <AppText variant="body" muted className="text-center mb-8">
        اختر من القائمة أدناه
      </AppText>

      <View className="flex-row flex-wrap">
        {LINKS.map((link) => (
          <Pressable
            key={link.href}
            onPress={() => router.push(link.href)}
            className="w-1/2 p-2 active:opacity-70"
          >
            <View className="bg-card-light dark:bg-card-dark rounded-2xl p-5 items-center border border-border-light dark:border-border-dark min-h-[140px] justify-center">
              <View className="w-12 h-12 bg-secondary-light dark:bg-secondary-dark rounded-xl items-center justify-center mb-3">
                <link.icon size={24} color={colors.text} />
              </View>
              <AppText variant="h3" className="text-center">
                {link.title}
              </AppText>
              <AppText variant="caption" muted className="text-center mt-1 leading-4">
                {link.description}
              </AppText>
            </View>
          </Pressable>
        ))}
      </View>
    </AppScreen>
  );
}
