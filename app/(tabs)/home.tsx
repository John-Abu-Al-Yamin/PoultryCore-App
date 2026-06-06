import { ScrollView, View, Pressable } from "react-native";
import type { AxiosResponse } from "axios";
import { router } from "expo-router";
import AppError from "@/src/components/custom/AppError";
import AppLoading from "@/src/components/custom/AppLoading";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { useGetDashboard, useGetMe } from "@/src/hooks/Actions/users/useCurdsUser";
import { useTheme } from "@/src/contexts/ThemeContext";
import type { DashboardData, ApiResponse, User } from "@/src/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/src/components/ui/Card";
import {
  Building2,
  Egg,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  ShoppingCart,
  Wallet,
  Skull,
  Ban,
  Users,
  ChevronLeft,
  Calendar,
  Clock,
} from "lucide-react-native";

const f = (n: number) => n.toLocaleString("en-US");

const formatDate = () => {
  const date = new Date();
  return date.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  onPress,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable 
      onPress={onPress}
      className="flex-1 active:opacity-80 active:scale-[0.98]"
    >
      <Card className="p-4 border-none shadow-none bg-muted-light dark:bg-muted-dark">
        <View className="flex-row items-center gap-2 mb-2">
          <View 
            style={{ backgroundColor: `${color}15` }}
            className="p-1.5 rounded-lg"
          >
            <Icon size={16} color={color} />
          </View>
          <AppText variant="caption" muted numberOfLines={1}>
            {label}
          </AppText>
        </View>
        <AppText variant="h2" className="text-xl">
          {value}
        </AppText>
      </Card>
    </Pressable>
  );
}

function FinRow({
  label,
  value,
  type = "default",
  isLast = false,
}: {
  label: string;
  value: string;
  type?: "default" | "success" | "error" | "warning";
  isLast?: boolean;
}) {
  const colorMap = {
    default: "",
    success: "text-success-light dark:text-success-dark",
    error: "text-error-light dark:text-error-dark",
    warning: "text-warning-light dark:text-warning-dark",
  };

  return (
    <View className={`flex-row items-center justify-between py-3 ${!isLast ? 'border-b border-border-light/50 dark:border-border-dark/50' : ''}`}>
      <AppText variant="bodySmall" muted>
        {label}
      </AppText>
      <AppText
        variant="body"
        className={`font-semibold ${colorMap[type]}`}
      >
        {value} ج.م
      </AppText>
    </View>
  );
}

export default function Home() {
  const { data, isPending, isError, refetch } = useGetDashboard();
  const { data: userData } = useGetMe();
  const { colors } = useTheme();

  const response = data as AxiosResponse<ApiResponse<DashboardData>> | undefined;
  const dashboard = response?.data?.data;
  
  const userResponse = userData as AxiosResponse<ApiResponse<User>> | undefined;
  const user = userResponse?.data?.data;

  const counts = dashboard?.counts;
  const financial = dashboard?.financial_summary;
  const production = dashboard?.production_insights;
  const alerts = dashboard?.alerts;

  const hasAlerts =
    (alerts?.recent_deaths_7_days ?? 0) > 0 ||
    (alerts?.unpaid_purchases ?? 0) > 0 ||
    (alerts?.unpaid_sales ?? 0) > 0 ||
    (alerts?.low_stock_batches?.length ?? 0) > 0 ||
    (alerts?.suppliers_with_dues?.length ?? 0) > 0 ||
    (alerts?.customers_with_debts?.length ?? 0) > 0 ||
    (alerts?.batches_ending_soon?.length ?? 0) > 0;

  if (isPending) {
    return (
      <AppScreen
        className="bg-background-light dark:bg-background-dark"
        scrollable={false}
      >
        <AppLoading fullScreen message="جاري تحميل البيانات..." />
      </AppScreen>
    );
  }

  if (isError) {
    return (
      <AppScreen
        className="bg-background-light dark:bg-background-dark"
        scrollable={false}
      >
        <AppError
          fullScreen
          title="فشل التحميل"
          message="تعذر تحميل بيانات الرئيسية. تحقق من اتصالك وحاول مرة أخرى."
          onRetry={refetch}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="px-4 pt-8 pb-12"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Welcome Header */}
        <View className="mb-8 flex-row justify-between items-center">
          <View>
            <AppText variant="h1" className="mb-1">مرحباً، {user?.name || "مجدداً"}</AppText>
            <View className="flex-row items-center gap-1.5">
              <Calendar size={14} color={colors.mutedForeground} />
              <AppText variant="caption" muted>{formatDate()}</AppText>
            </View>
          </View>
          <Pressable 
            onPress={() => router.push("/(tabs)/more")}
            className="w-10 h-10 rounded-full bg-muted-light dark:bg-muted-dark items-center justify-center border border-border-light dark:border-border-dark"
          >
            <Users size={20} color={colors.primary} />
          </Pressable>
        </View>

        {/* Priority Stats Grid */}
        <View className="flex-row gap-3 mb-3">
          <StatCard
            icon={Users}
            label="إجمالي الطيور"
            value={f(production?.total_current_poultry ?? 0)}
            color="#3b82f6"
            onPress={() => router.push("/(tabs)/batches")}
          />
          <StatCard
            icon={Egg}
            label="دفعات نشطة"
            value={f(counts?.active_batches ?? 0)}
            color="#f59e0b"
            onPress={() => router.push("/(tabs)/batches")}
          />
        </View>
        <View className="flex-row gap-3 mb-8">
          <StatCard
            icon={TrendingUp}
            label="صافي الربح"
            value={f(financial?.net_revenue ?? 0)}
            color={colors.success}
            onPress={() => router.push("/(tabs)/finance")}
          />
          <StatCard
            icon={Skull}
            label="نفوق"
            value={f(alerts?.recent_deaths_7_days ?? 0)}
            color={colors.error}
          />
        </View>

        {/* Financial Overview Card */}
        <Card className="mb-8">
          <CardHeader className="flex-row items-center justify-between pb-2">
            <View>
              <CardTitle>الملخص المالي</CardTitle>
              <CardDescription>نظرة عامة على الأداء المالي</CardDescription>
            </View>
            <Pressable 
              onPress={() => router.push("/(tabs)/finance")}
              className="flex-row items-center gap-1"
            >
              <AppText variant="caption" className="text-primary-light dark:text-primary-dark font-medium">المزيد</AppText>
              <ChevronLeft size={14} color={colors.primary} />
            </Pressable>
          </CardHeader>
          <CardContent>
            <FinRow
              label="إجمالي الإيرادات"
              value={f(financial?.total_sales_revenue ?? 0)}
              type="success"
            />
            <FinRow
              label="إجمالي التكاليف"
              value={f((financial?.total_purchases_cost ?? 0) + (financial?.total_expenses ?? 0))}
              type="error"
            />
            <FinRow
              label="صافي الربح"
              value={f(financial?.net_revenue ?? 0)}
              type={ (financial?.net_revenue ?? 0) >= 0 ? "success" : "error"}
              isLast={!( (financial?.outstanding_customer_debts ?? 0) > 0 || (financial?.outstanding_supplier_dues ?? 0) > 0 )}
            />
            
            {(financial?.outstanding_customer_debts ?? 0) > 0 && (
               <FinRow
               label="ديون العملاء المستحقة"
               value={f(financial?.outstanding_customer_debts ?? 0)}
               type="warning"
             />
            )}
            {(financial?.outstanding_supplier_dues ?? 0) > 0 && (
               <FinRow
               label="مستحقات الموردين"
               value={f(financial?.outstanding_supplier_dues ?? 0)}
               type="error"
               isLast
             />
            )}
          </CardContent>
        </Card>

        {/* Alerts Section */}
        {hasAlerts && (
          <View className="mb-8">
            <AppText variant="h3" className="mb-4">تنبيهات هامة</AppText>
            <Card className="border-warning-light/30 dark:border-warning-dark/30">
               <View className="p-4 gap-y-3">
                  {(alerts?.recent_deaths_7_days ?? 0) > 5 && (
                    <View className="flex-row items-center gap-3">
                      <View className="p-2 bg-error-light/10 dark:bg-error-dark/10 rounded-full">
                        <Skull size={16} color={colors.error} />
                      </View>
                      <AppText variant="bodySmall" className="flex-1">ارتفاع ملحوظ في حالات النفوق ({alerts?.recent_deaths_7_days})</AppText>
                    </View>
                  )}
                  {(alerts?.unpaid_purchases ?? 0) > 0 && (
                    <View className="flex-row items-center gap-3">
                      <View className="p-2 bg-warning-light/10 dark:bg-warning-dark/10 rounded-full">
                        <ShoppingCart size={16} color={colors.warning} />
                      </View>
                      <AppText variant="bodySmall" className="flex-1">لديك {alerts?.unpaid_purchases} فواتير مشتريات لم تسدد</AppText>
                    </View>
                  )}
                   {(alerts?.unpaid_sales ?? 0) > 0 && (
                    <View className="flex-row items-center gap-3">
                      <View className="p-2 bg-warning-light/10 dark:bg-warning-dark/10 rounded-full">
                        <Wallet size={16} color={colors.warning} />
                      </View>
                      <AppText variant="bodySmall" className="flex-1">لديك {alerts?.unpaid_sales} فواتير مبيعات لم يتم تحصيلها</AppText>
                    </View>
                  )}
                  {(alerts?.batches_ending_soon?.length ?? 0) > 0 && (
                    <View className="flex-row items-center gap-3">
                      <View className="p-2 bg-primary-light/10 dark:bg-primary-dark/10 rounded-full">
                        <Clock size={16} color={colors.primary} />
                      </View>
                      <AppText variant="bodySmall" className="flex-1">هناك {alerts?.batches_ending_soon?.length} دورات تنتهي قريباً</AppText>
                    </View>
                  )}
               </View>
            </Card>
          </View>
        )}

        {/* Production Overview */}
        <View className="mb-8">
           <AppText variant="h3" className="mb-4">نظرة سريعة</AppText>
           <View className="flex-row gap-3">
              <Card className="flex-1 p-4 items-center gap-2">
                 <Building2 size={24} color={colors.primary} />
                 <AppText variant="h3">{counts?.barns ?? 0}</AppText>
                 <AppText variant="caption" muted>العنابر</AppText>
              </Card>
              <Card className="flex-1 p-4 items-center gap-2">
                 <Users size={24} color={colors.primary} />
                 <AppText variant="h3">{counts?.customers ?? 0}</AppText>
                 <AppText variant="caption" muted>العملاء</AppText>
              </Card>
              <Card className="flex-1 p-4 items-center gap-2">
                 <ShoppingCart size={24} color={colors.primary} />
                 <AppText variant="h3">{counts?.suppliers ?? 0}</AppText>
                 <AppText variant="caption" muted>الموردين</AppText>
              </Card>
           </View>
        </View>

      </ScrollView>
    </AppScreen>
  );
}
