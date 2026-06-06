import { Pressable, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/src/contexts/ThemeContext";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { Card } from "@/src/components/ui/Card";
import { 
  ArrowUpFromLine, 
  HandCoins, 
  ShoppingCart, 
  TrendingUp,
  ChevronLeft,
  CircleDollarSign
} from "lucide-react-native";

const LINKS = [
  { screen: "expenses", title: "المصروفات", icon: ArrowUpFromLine, description: "تسجيل وإدارة المصروفات", color: "#ef4444" },
  { screen: "payments", title: "المدفوعات", icon: HandCoins, description: "المدفوعات والتحصيلات", color: "#3b82f6" },
  { screen: "purchases", title: "المشتريات", icon: ShoppingCart, description: "إدارة فواتير الشراء", color: "#f59e0b" },
  { screen: "sales", title: "المبيعات", icon: TrendingUp, description: "إدارة فواتير البيع", color: "#10b981" },
] as const;

export default function FinanceScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="px-4 pt-12 pb-24"
    >
      {/* Header Section */}
      <View className="mb-8 items-center">
        <View className="w-16 h-16 bg-primary-light/10 dark:bg-primary-dark/10 rounded-[24px] items-center justify-center mb-4 border border-primary-light/20 dark:border-primary-dark/20">
          <CircleDollarSign size={32} color={colors.primary} />
        </View>
        <AppText variant="h1" className="text-center mb-1">
          الإدارة المالية
        </AppText>
        <AppText variant="body" muted className="text-center">
          تتبع الأرباح والمصروفات بكل سهولة
        </AppText>
      </View>

      {/* Stats Summary (Placeholder for future) */}
      <View className="flex-row gap-3 mb-8">
        <View className="flex-1 bg-card-light dark:bg-card-dark p-4 rounded-3xl border border-border-light dark:border-border-dark shadow-sm">
          <AppText variant="caption" muted className="mb-1">إجمالي المبيعات</AppText>
          <AppText variant="h3" className="text-success-light dark:text-success-dark">0.00 ر.س</AppText>
        </View>
        <View className="flex-1 bg-card-light dark:bg-card-dark p-4 rounded-3xl border border-border-light dark:border-border-dark shadow-sm">
          <AppText variant="caption" muted className="mb-1">إجمالي المصاريف</AppText>
          <AppText variant="h3" className="text-error-light dark:text-error-dark">0.00 ر.س</AppText>
        </View>
      </View>

      {/* Quick Links Grid */}
      <View className="flex-row flex-wrap">
        {LINKS.map((link) => (
          <Pressable
            key={link.screen}
            onPress={() => navigation.navigate(link.screen)}
            className="w-1/2 p-1.5 active:opacity-70 active:scale-95 transition-all"
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
                <AppText variant="caption" muted className="mt-1 leading-4" numberOfLines={2}>
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
