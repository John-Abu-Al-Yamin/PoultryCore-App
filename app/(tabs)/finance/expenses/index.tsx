import AppError from "@/src/components/custom/AppError";
import AppLoading from "@/src/components/custom/AppLoading";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { Card } from "@/src/components/ui/Card";
import { expenseTypeOptions } from "@/src/constants/expenseTypes";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useGetAllExpenses } from "@/src/hooks/Actions/expenses/useCurdExpenses";
import type { Expense } from "@/src/types/api";
import { router } from "expo-router";
import {
  Banknote,
  Calendar,
  ChevronLeft,
  ClipboardList,
  Plus,
  ReceiptText,
} from "lucide-react-native";
import { Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getExpenseTypeLabel = (type: string) => {
  const option = expenseTypeOptions.find(
    (item) => item.value.toLowerCase() === type.toLowerCase(),
  );

  return option?.label || type;
};

export default function ExpensesPage() {
  const { data, isPending, isError, refetch } = useGetAllExpenses();
  const { colors } = useTheme();

  const expensesList: Expense[] = data?.data?.data || [];

  if (isPending) {
    return (
      <AppScreen
        className="bg-background-light dark:bg-background-dark"
        scrollable={false}
      >
        <AppLoading fullScreen message="جاري تحميل المصروفات..." />
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
          message="تعذر تحميل قائمة المصروفات."
          onRetry={refetch}
          onBack={() => router.back()}
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
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <AppText variant="h1">المصروفات</AppText>
            <AppText variant="bodySmall" muted className="mt-1">
              متابعة مصروفات الدفعات
            </AppText>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-primary-light dark:bg-primary-dark px-4 py-2 rounded-xl flex-row items-center gap-1.5"
            onPress={() => router.push("/finance/expenses/add")}
          >
            <Plus size={16} color={colors.background} />
            <Text className="text-background-light dark:text-background-dark font-bold text-sm">
              إضافة مصروف
            </Text>
          </TouchableOpacity>
        </View>

        {expensesList.length === 0 ? (
          <View className="bg-muted-light dark:bg-muted-dark rounded-2xl p-8 items-center justify-center border border-dashed border-border-light dark:border-border-dark mt-4">
            <ReceiptText size={34} color={colors.mutedForeground} />
            <AppText muted className="mt-3 text-center">
              لا توجد مصروفات
            </AppText>
          </View>
        ) : (
          <View className="gap-4">
            {expensesList.map((expense) => (
              <Pressable
                key={expense.id}
                onPress={() => router.push(`/finance/expenses/${expense.id}` as any)}
                className="active:opacity-80 active:scale-[0.98] transition-all"
              >
                <Card>
                  <View className="p-4">
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center gap-3.5 flex-1">
                        <View className="w-11 h-11 rounded-[14px] bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 items-center justify-center">
                          <ReceiptText size={20} color="#f59e0b" />
                        </View>
                        <View className="flex-1 justify-center">
                          <View className="flex-row items-center gap-1.5 mb-0.5">
                            <AppText variant="h3" numberOfLines={1}>
                              {Number(expense.amount).toLocaleString()} ج.م
                            </AppText>
                            <View className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                              <AppText className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                {getExpenseTypeLabel(expense.type)}
                              </AppText>
                            </View>
                          </View>
                          <AppText variant="bodySmall" muted numberOfLines={1}>
                            {expense.batch?.poultry_type || "---"}
                          </AppText>
                        </View>
                      </View>
                      <ChevronLeft size={18} color={colors.mutedForeground} />
                    </View>

                    <View className="flex-row gap-3">
                      <View className="flex-1 flex-row items-center bg-muted-light dark:bg-muted-dark rounded-[14px] p-2.5 border border-border-light dark:border-border-dark gap-2.5">
                        <View className="w-7 h-7 rounded-full bg-background-light dark:bg-background-dark items-center justify-center shadow-sm">
                          <Calendar size={14} color={colors.text} />
                        </View>
                        <View className="flex-1">
                          <AppText variant="caption" muted className="mb-[2px] text-[10px]">
                            التاريخ
                          </AppText>
                          <AppText className="font-bold text-sm leading-tight">
                            {formatDate(expense.date)}
                          </AppText>
                        </View>
                      </View>


                      <View className="flex-1 flex-row items-center bg-muted-light dark:bg-muted-dark rounded-[14px] p-2.5 border border-border-light dark:border-border-dark gap-2.5">
                        <View className="w-7 h-7 rounded-full bg-background-light dark:bg-background-dark items-center justify-center shadow-sm">
                          <Banknote size={14} color={colors.text} />
                        </View>
                        <View className="flex-1">
                          <AppText variant="caption" muted className="mb-[2px] text-[10px]">
                            النوع
                          </AppText>
                          <AppText className="font-bold text-sm leading-tight" numberOfLines={1}>
                            {getExpenseTypeLabel(expense.type)}
                          </AppText>
                        </View>
                      </View>
                    </View>

                    {expense.notes && (
                      <View className="mt-3 pt-3 border-t border-border-light/50 dark:border-border-dark/50 flex-row items-center gap-2">
                        <ClipboardList size={14} color={colors.mutedForeground} />
                        <AppText variant="caption" muted numberOfLines={1}>
                          {expense.notes}
                        </AppText>
                      </View>
                    )}
                  </View>
                </Card>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </AppScreen>
  );
}
