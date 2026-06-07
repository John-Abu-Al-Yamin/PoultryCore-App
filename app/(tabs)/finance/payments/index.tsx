import AppError from "@/src/components/custom/AppError";
import AppLoading from "@/src/components/custom/AppLoading";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { Card } from "@/src/components/ui/Card";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useGetAllPayments } from "@/src/hooks/Actions/payments/useCurdPayments";
import type { Payment } from "@/src/types/api";
import { router } from "expo-router";
import {
  ArrowRightLeft,
  Banknote,
  Building2,
  ChevronLeft,
  Plus,
  User,
  Wallet,
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

const typeConfig: Record<
  string,
  { label: string; badgeClass: string; textClass: string; icon: any }
> = {
  to_supplier: {
    label: "دفع لمورد",
    badgeClass:
      "bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20",
    textClass: "text-rose-600 dark:text-rose-400",
    icon: Building2,
  },
  from_customer: {
    label: "تحصيل من عميل",
    badgeClass:
      "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20",
    textClass: "text-emerald-600 dark:text-emerald-400",
    icon: User,
  },
};

const methodLabels: Record<string, string> = {
  cash: "نقداً",
  bank_transfer: "تحويل بنكي",
  cheque: "شيك",
};

const PaymentsPage = () => {
  const { data: payments, isPending, isError, refetch } = useGetAllPayments();
  const { colors } = useTheme();

  const paymentsList: Payment[] = payments?.data?.data || [];

  if (isPending) {
    return (
      <AppScreen
        className="bg-background-light dark:bg-background-dark"
        scrollable={false}
      >
        <AppLoading fullScreen message="جاري تحميل المدفوعات..." />
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
          message="تعذر تحميل قائمة المدفوعات."
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
        data={paymentsList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 100,
          gap: 16,
        }}
        ListHeaderComponent={
          <View className="flex-row items-center justify-between mb-6">
            <AppText variant="h1">المدفوعات</AppText>
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-primary-light dark:bg-primary-dark px-4 py-2 rounded-xl flex-row items-center gap-1.5"
              onPress={() => router.push("/finance/payments/add")}
            >
              <Plus size={16} color={colors.background} />
              <Text className="text-background-light dark:text-background-dark font-bold text-sm">
                إضافة دفعة
              </Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <AppText variant="body" muted className="text-center mt-4">
            لا توجد مدفوعات
          </AppText>
        }
        renderItem={({ item: payment }) => {
          const type = typeConfig[payment.type] || typeConfig.to_supplier;

          return (
            <Pressable
              onPress={() =>
                router.push(`/finance/payments/${payment.id}` as any)
              }
              className="active:opacity-80 active:scale-[0.98] transition-all"
            >
              <Card>
                <View className="p-4">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-3.5 flex-1">
                      <View className="w-11 h-11 rounded-[14px] bg-muted-light dark:bg-muted-dark border border-border-light dark:border-border-dark items-center justify-center">
                        <ArrowRightLeft size={20} color={colors.text} />
                      </View>
                      <View className="flex-1 justify-center">
                        <View className="flex-row items-center gap-1.5 mb-0.5">
                          <AppText
                            variant="h3"
                            className="leading-tight"
                            numberOfLines={1}
                          >
                            {Number(payment.amount).toLocaleString()} ج.م
                          </AppText>
                          <View
                            className={`px-2 py-0.5 rounded-md ${type.badgeClass}`}
                          >
                            <AppText
                              className={`text-[10px] font-bold ${type.textClass}`}
                            >
                              {type.label}
                            </AppText>
                          </View>
                        </View>
                        <AppText variant="bodySmall" muted numberOfLines={1}>
                          {payment.supplier?.name ||
                            payment.customer?.name ||
                            "---"}
                        </AppText>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row gap-3">
                    <View className="flex-1 flex-row items-center bg-muted-light dark:bg-muted-dark rounded-[14px] p-2.5 border border-border-light dark:border-border-dark gap-2.5">
                      <View className="w-7 h-7 rounded-full bg-background-light dark:bg-background-dark items-center justify-center shadow-sm">
                        <Wallet size={14} color={colors.text} />
                      </View>
                      <View className="flex-1">
                        <AppText
                          variant="caption"
                          muted
                          className="mb-[2px] text-[10px]"
                        >
                          طريقة الدفع
                        </AppText>
                        <AppText className="font-bold text-sm leading-tight">
                          {methodLabels[payment.payment_method] ||
                            payment.payment_method}
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
                          المبلغ
                        </AppText>
                        <AppText className="font-bold text-sm leading-tight">
                          {Number(payment.amount).toLocaleString()}
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
                          {formatDate(payment.payment_date)}
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

export default PaymentsPage;
