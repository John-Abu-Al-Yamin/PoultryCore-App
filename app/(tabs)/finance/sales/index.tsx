import AppError from "@/src/components/custom/AppError";
import AppLoading from "@/src/components/custom/AppLoading";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { Card } from "@/src/components/ui/Card";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useGetAllSales } from "@/src/hooks/Actions/sales/useCurdSales";
import type { Sale } from "@/src/types/api";
import { router } from "expo-router";
import {
  Banknote,
  ChevronLeft,
  Package,
  Plus,
  TrendingUp,
} from "lucide-react-native";
import {
  FlatList,
  Pressable,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const statusConfig: Record<
  string,
  { label: string; badgeClass: string; textClass: string }
> = {
  paid: {
    label: "مدفوع",
    badgeClass: "bg-success-light dark:bg-success-dark",
    textClass: "text-white dark:text-black",
  },
  unpaid: {
    label: "غير مدفوع",
    badgeClass:
      "bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50",
    textClass: "text-red-600 dark:text-red-400",
  },
  partial: {
    label: "مدفوع جزئياً",
    badgeClass:
      "bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50",
    textClass: "text-amber-600 dark:text-amber-400",
  },
};

const SalesPage = () => {
  const { data: sales, isPending, isError, refetch } = useGetAllSales();
  const { colors } = useTheme();

  const salesList: Sale[] = sales?.data?.data || [];

  if (isPending) {
    return (
      <AppScreen
        className="bg-background-light dark:bg-background-dark"
        scrollable={false}
      >
        <AppLoading fullScreen message="جاري تحميل المبيعات..." />
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
          message="تعذر تحميل قائمة المبيعات. تحقق من اتصالك وحاول مرة أخرى."
          onRetry={refetch}
          onBack={() => router.back()}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      scrollable={false}
    >
      <FlatList
        data={salesList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 100,
          gap: 16,
        }}
        ListHeaderComponent={
          <View className="flex-row items-center justify-between mb-6">
            <AppText variant="h1">المبيعات</AppText>
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-primary-light dark:bg-primary-dark px-4 py-2 rounded-xl flex-row items-center gap-1.5"
              onPress={() => router.push("/finance/sales/add")}
            >
              <Plus size={16} color={colors.background} />
              <Text className="text-background-light dark:text-background-dark font-bold text-sm">
                إضافة مبيعات
              </Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <AppText variant="body" muted className="text-center mt-4">
            لا توجد مبيعات
          </AppText>
        }
        renderItem={({ item: sale }) => {
          const status = statusConfig[sale.status] || statusConfig.unpaid;

          return (
            <Pressable
              onPress={() =>
                router.push(`/finance/sales/${sale.id}` as any)
              }
              className="active:opacity-80 active:scale-[0.98] transition-all"
            >
              <Card>
                <View className="p-4">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-3.5 flex-1">
                      <View className="w-11 h-11 rounded-[14px] bg-muted-light dark:bg-muted-dark border border-border-light dark:border-border-dark items-center justify-center">
                        <TrendingUp size={20} color={colors.text} />
                      </View>
                      <View className="flex-1 justify-center">
                        <AppText
                          variant="h3"
                          className="leading-tight mb-0.5"
                          numberOfLines={1}
                        >
                          {sale.item_name}
                        </AppText>
                        <View className="flex-row items-center gap-1.5">
                          <Package size={13} color={colors.mutedForeground} />
                          <AppText variant="bodySmall" muted numberOfLines={1}>
                            {sale.quantity} الكميه
                          </AppText>
                        </View>
                      </View>
                    </View>
                    <View
                      className={`px-2.5 py-1 rounded-md ${status.badgeClass}`}
                    >
                      <AppText
                        className={`text-[10px] font-bold ${status.textClass}`}
                      >
                        {status.label}
                      </AppText>
                    </View>
                  </View>

                  <View className="flex-row gap-3">
                    <View className="flex-1 flex-row items-center bg-muted-light dark:bg-muted-dark rounded-[14px] p-2.5 border border-border-light dark:border-border-dark gap-2.5">
                      <View className="w-7 h-7 rounded-full bg-background-light dark:bg-background-dark items-center justify-center shadow-sm">
                        <Banknote size={14} color={colors.text} />
                      </View>
                      <View className="flex-1">
                        <AppText
                          variant="caption"
                          muted
                          className="mb-[2px] text-[10px]"
                        >
                          الإجمالي
                        </AppText>
                        <AppText className="font-bold text-sm leading-tight">
                          {Number(sale.total_price).toLocaleString()}
                        </AppText>
                      </View>
                    </View>

                    <View className="flex-1 flex-row items-center bg-muted-light dark:bg-muted-dark rounded-[14px] p-2.5 border border-border-light dark:border-border-dark gap-2.5">
                      <View className="w-7 h-7 rounded-full bg-background-light dark:bg-background-dark items-center justify-center shadow-sm">
                        <Banknote size={14} color={colors.text} />
                      </View>
                      <View className="flex-1">
                        <AppText
                          variant="caption"
                          muted
                          className="mb-[2px] text-[10px]"
                        >
                          المدفوع
                        </AppText>
                        <AppText className="font-bold text-sm leading-tight">
                          {Number(sale.paid_amount).toLocaleString()}
                        </AppText>
                      </View>
                    </View>

                    <View className="flex-1 flex-row items-center bg-muted-light dark:bg-muted-dark rounded-[14px] p-2.5 border border-border-light dark:border-border-dark gap-2.5">
                      <View className="w-7 h-7 rounded-full bg-background-light dark:bg-background-dark items-center justify-center shadow-sm">
                        <ChevronLeft size={14} color={colors.text} />
                      </View>
                      <View className="flex-1">
                        <AppText
                          variant="caption"
                          muted
                          className="mb-[2px] text-[10px]"
                        >
                          التاريخ
                        </AppText>
                        <AppText className="font-bold text-sm leading-tight">
                          {formatDate(sale.sale_date)}
                        </AppText>
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            </Pressable>
          );
        }}
      />
    </AppScreen>
  );
};

export default SalesPage;
