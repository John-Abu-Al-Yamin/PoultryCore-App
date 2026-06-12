import { Pressable, View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/src/contexts/ThemeContext";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { Card } from "@/src/components/ui/Card";
import {
  Warehouse,
  Users,
  Truck,
  Settings,
  ChevronLeft,
  LayoutGrid,
} from "lucide-react-native";

const LINKS = [
  {
    screen: "barn",
    title: "العنبر",
    icon: Warehouse,
    description: "إدارة العنابر والمخازن",
    color: "#6366f1",
  },
  {
    screen: "customers",
    title: "العملاء",
    icon: Users,
    description: "إدارة العملاء والمبيعات",
    color: "#8b5cf6",
  },
  {
    screen: "suppliers",
    title: "الموردين",
    icon: Truck,
    description: "إدارة الموردين والمشتريات",
    color: "#ec4899",
  },
  {
    screen: "settings",
    title: "الإعدادات",
    icon: Settings,
    description: "إعدادات التطبيق والتنبيهات",
    color: "#64748b",
  },
] as const;

export default function MoreScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="px-4 pt-12 pb-24"
    >
      {/* Header Section */}
      <View className="mb-8 items-center">
        <View className="w-16 h-16 bg-secondary-light dark:bg-secondary-dark rounded-[24px] items-center justify-center mb-4 border border-border-light dark:border-border-dark">
          <LayoutGrid size={32} color={colors.text} />
        </View>
        <AppText variant="h1" className="text-center mb-1">
          المزيد
        </AppText>
        <AppText variant="body" muted className="text-center">
          إدارة كافة جوانب المزرعة في مكان واحد
        </AppText>
      </View>

      {/* Main Options Grid */}
      <View className="flex-row flex-wrap">
        {LINKS.map((link) => (
          <Pressable
            key={link.screen}
            onPress={() => navigation.navigate(link.screen)}
            className="w-1/2 p-1.5 active:opacity-80 active:scale-[0.98] "
          >
            <Card className="p-5 h-[160px] justify-between">
              <View
                style={{ backgroundColor: `${link.color}15` }}
                className="w-12 h-12 rounded-2xl items-center justify-center mb-3"
              >
                <link.icon size={24} color={link.color} />
              </View>
              <View>
                <View className="flex-row items-center justify-between">
                  <AppText variant="h3" className="text-sm">
                    {link.title}
                  </AppText>
                  <ChevronLeft size={14} color={colors.mutedForeground} />
                </View>
                <AppText
                  variant="caption"
                  muted
                  className="mt-1 leading-4"
                  numberOfLines={2}
                >
                  {link.description}
                </AppText>
              </View>
            </Card>
          </Pressable>
        ))}
      </View>
    </AppScreen>
  );
}
