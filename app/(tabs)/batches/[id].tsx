import { View, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  Calendar,
  ChevronRight,
  ClipboardList,
  DollarSign,
  NotebookText,
  Warehouse,
  Edit2,
  Bird,
  Clock,
  ReceiptText,
  Trash2,
  Tags,
} from "lucide-react-native";
import AppError from "@/src/components/custom/AppError";
import AppLoading from "@/src/components/custom/AppLoading";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import AppDeleteModal from "@/src/components/custom/AppDeleteModal";
import { Card } from "@/src/components/ui/Card";
import {
  useGetBatchById,
  useDeleteBatch,
} from "@/src/hooks/Actions/batch/useCurdBatch";
import { useGetAllExpenses } from "@/src/hooks/Actions/expenses/useCurdExpenses";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useState } from "react";
import { toast } from "@/src/services/toast";
import { expenseTypeOptions } from "@/src/constants/expenseTypes";

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
  active: {
    label: "نشط",
    badgeClass: "bg-success-light dark:bg-success-dark",
    textClass: "text-white dark:text-black",
  },
  closed: {
    label: "مغلق",
    badgeClass:
      "bg-gray-200 dark:bg-gray-800 border border-border-light dark:border-border-dark",
    textClass: "text-mutedForeground-light dark:text-mutedForeground-dark",
  },
};

const poultryLabels: Record<string, string> = {
  chick: "كتاكيت",
  duck: "بط",
};

const getExpenseTypeLabel = (type: string) => {
  const option = expenseTypeOptions.find(
    (item) => item.value.toLowerCase() === type.toLowerCase(),
  );

  return option?.label || type;
};

const BatchDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: batch,
    isPending,
    isError,
    refetch,
  } = useGetBatchById(id || "");
  const { data: expenses, isPending: expensesIsPending } = useGetAllExpenses();
  const { mutate: deleteBatch, isPending: isDeleting } = useDeleteBatch();
  const { colors } = useTheme();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const batchDetails = batch?.data?.data;
  const batchExpenses = (expenses?.data?.data ?? []).filter(
    (expense) => Number(expense.batch_id) === Number(id),
  );
  const totalExpenses = batchExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0,
  );

  const handleDelete = () => {
    deleteBatch(
      { id: id as string },
      {
        onSuccess: () => {
          setShowDeleteModal(false);
          toast.success("تم حذف الدفعة بنجاح");
          router.replace("/batches");
        },
        onError: (error: any) => {
          setShowDeleteModal(false);
          const errorMessage =
            error?.response?.data?.message || "فشل في حذف الدفعة";
          toast.error(errorMessage);
        },
      },
    );
  };

  if (isPending) {
    return (
      <AppScreen
        className="bg-background-light dark:bg-background-dark"
        scrollable={false}
      >
        <AppLoading fullScreen message="جاري تحميل الدفعة..." />
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
          message="تعذر تحميل بيانات الدفعة."
          onRetry={refetch}
          onBack={() => router.back()}
        />
      </AppScreen>
    );
  }

  const status =
    statusConfig[batchDetails?.status || ""] || statusConfig.closed;
  const poultryLabel =
    poultryLabels[batchDetails?.poultry_type || ""] ||
    batchDetails?.poultry_type ||
    "";

  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      scrollable={false}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: 100,
        }}
      >
        {/* Header */}
        <View className="flex-row items-start justify-between mb-6">
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-2">
              <AppText variant="h1">دفعة #{batchDetails?.id}</AppText>
              <View className={`px-2.5 py-1 rounded-md ${status.badgeClass}`}>
                <AppText
                  className={`text-[10px] font-bold ${status.textClass}`}
                >
                  {status.label}
                </AppText>
              </View>
            </View>
            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center gap-1.5">
                <Warehouse size={14} color={colors.mutedForeground} />
                <AppText variant="bodySmall" muted>
                  {batchDetails?.barn_id
                    ? `عنبر #${batchDetails.barn_id}`
                    : "غير محدد"}
                </AppText>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Calendar size={14} color={colors.mutedForeground} />
                <AppText variant="bodySmall" muted>
                  {formatDate(batchDetails?.created_at || "")}
                </AppText>
              </View>
            </View>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setShowDeleteModal(true)}
              className="w-10 h-10 rounded-[14px] bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 items-center justify-center"
            >
              <Trash2 size={18} color="#ef4444" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push(`/batches/edit/${id}` as any)}
              className="w-10 h-10 rounded-[14px] bg-muted-light dark:bg-muted-dark border border-border-light dark:border-border-dark items-center justify-center"
            >
              <Edit2 size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-primary-light dark:bg-primary-dark rounded-[24px] p-5 shadow-sm">
            <View className="w-10 h-10 rounded-full bg-white/20 dark:bg-black/10 items-center justify-center mb-4 shadow-sm">
              <Bird size={20} color={colors.background} />
            </View>
            <AppText inverse className="mb-1 text-xs">
              الكمية الحالية
            </AppText>
            <View className="flex-row items-baseline gap-1">
              <AppText inverse className="font-bold text-2xl">
                {batchDetails?.current_quantity?.toLocaleString()}
              </AppText>
              <AppText inverse className="text-xs">
                طائر
              </AppText>
            </View>
          </View>

          <View className="flex-1 bg-muted-light dark:bg-muted-dark rounded-[24px] p-5 border border-border-light dark:border-border-dark shadow-sm">
            <View className="w-10 h-10 rounded-full bg-background-light dark:bg-background-dark items-center justify-center mb-4 shadow-sm">
              <Tags size={20} color={colors.text} />
            </View>
            <AppText variant="caption" muted className="mb-1">
              النوع
            </AppText>
            <AppText className="font-bold text-2xl text-text-light dark:text-text-dark">
              {poultryLabel}
            </AppText>
          </View>
        </View>

        {/* Details Card */}
        <Card className="mb-6">
          <View className="p-4">
            <AppText variant="h3" className="mb-4">
              تفاصيل الدفعة
            </AppText>

            <View className="bg-muted-light dark:bg-muted-dark rounded-xl p-4 border border-border-light dark:border-border-dark">
              <View className="flex-row items-center justify-between mb-4">
                <AppText variant="caption" muted>
                  تاريخ البداية
                </AppText>
                <View className="flex-row items-center gap-1.5">
                  <Clock size={14} color={colors.mutedForeground} />
                  <AppText className="font-bold text-sm">
                    {formatDate(batchDetails?.start_date || "")}
                  </AppText>
                </View>
              </View>

              <View className="h-[1px] bg-border-light dark:bg-border-dark mb-4" />

              <View className="flex-row items-center justify-between mb-4">
                <AppText variant="caption" muted>
                  تاريخ النهاية
                </AppText>
                <View className="flex-row items-center gap-1.5">
                  <Clock size={14} color={colors.mutedForeground} />
                  <AppText className="font-bold text-sm">
                    {batchDetails?.end_date
                      ? formatDate(batchDetails.end_date)
                      : "---"}
                  </AppText>
                </View>
              </View>

              <View className="h-[1px] bg-border-light dark:bg-border-dark mb-4" />

              <View className="flex-row items-center justify-between">
                <AppText variant="caption" muted>
                  الكمية الحالية
                </AppText>
                <View className="flex-row items-center gap-1.5">
                  <Bird size={14} color={colors.mutedForeground} />
                  <AppText className="font-bold text-sm">
                    {batchDetails?.current_quantity?.toLocaleString()}
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Notes */}
        {batchDetails?.notes && (
          <Card className="mb-6">
            <View className="p-4 flex-row gap-3">
              <View className="mt-0.5">
                <NotebookText size={18} color={colors.mutedForeground} />
              </View>
              <View className="flex-1">
                <AppText variant="label" className="mb-1">
                  ملاحظات
                </AppText>
                <AppText variant="bodySmall" muted className="leading-relaxed">
                  {batchDetails.notes}
                </AppText>
              </View>
            </View>
          </Card>
        )}

        {/* Expenses */}
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="w-1.5 h-6 rounded-full bg-primary-light dark:bg-primary-dark" />
            <ReceiptText size={18} color={colors.text} />
            <AppText variant="h3">مصروفات الدفعة</AppText>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/finance/expenses/add")}
            className="px-3 py-1.5 rounded-full bg-muted-light dark:bg-muted-dark border border-border-light dark:border-border-dark"
          >
            <AppText variant="caption" className="font-bold">
              إضافة
            </AppText>
          </TouchableOpacity>
        </View>

        <View className="bg-primary-light dark:bg-primary-dark rounded-[28px] p-5 mb-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View>
              <AppText inverse variant="caption" className="opacity-70 mb-1">
                إجمالي المصروفات
              </AppText>
              <AppText inverse className="text-3xl font-bold">
                {totalExpenses.toLocaleString()}{" "}
                <AppText inverse variant="bodySmall" className="opacity-70">
                  ج.م
                </AppText>
              </AppText>
            </View>
            <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center">
              <DollarSign size={24} color="white" />
            </View>
          </View>
          <View className="h-[1px] bg-white/10 my-4" />
          <View className="flex-row items-center gap-2">
            <View className="w-2 h-2 rounded-full bg-amber-300" />
            <AppText inverse variant="caption" className="opacity-70">
              {batchExpenses.length} مصروف مسجل لهذه الدفعة
            </AppText>
          </View>
        </View>

        {expensesIsPending ? (
          <Card className="mb-6">
            <View className="p-6 items-center">
              <AppText muted>جاري تحميل المصروفات...</AppText>
            </View>
          </Card>
        ) : batchExpenses.length === 0 ? (
          <View className="bg-muted-light dark:bg-muted-dark rounded-2xl p-8 items-center justify-center border border-dashed border-border-light dark:border-border-dark mb-6">
            <ReceiptText size={32} color={colors.mutedForeground} />
            <AppText muted className="mt-3 text-center">
              لا توجد مصروفات مسجلة لهذه الدفعة
            </AppText>
          </View>
        ) : (
          <View className="gap-3 mb-6">
            {batchExpenses.map((expense) => (
              <TouchableOpacity
                key={expense.id}
                activeOpacity={0.85}
                onPress={() =>
                  router.push(`/finance/expenses/${expense.id}` as any)
                }
              >
                <Card className="overflow-hidden">
                  <View className="p-4">
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center gap-3 flex-1">
                        <View className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 items-center justify-center">
                          <ReceiptText size={20} color="#f59e0b" />
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-center gap-2 mb-1">
                            <AppText className="font-bold text-lg">
                              {Number(expense.amount).toLocaleString()} ج.م
                            </AppText>
                            <View className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                              <AppText className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                {getExpenseTypeLabel(expense.type)}
                              </AppText>
                            </View>
                          </View>
                          <View className="flex-row items-center gap-1.5">
                            <Calendar size={13} color={colors.mutedForeground} />
                            <AppText variant="caption" muted>
                              {formatDate(expense.date)}
                            </AppText>
                          </View>
                        </View>
                      </View>
                      <ChevronRight size={20} color={colors.mutedForeground} />
                    </View>

                    {expense.notes && (
                      <View className="pt-3 border-t border-border-light/50 dark:border-border-dark/50 flex-row items-center gap-2">
                        <ClipboardList
                          size={14}
                          color={colors.mutedForeground}
                        />
                        <AppText variant="caption" muted numberOfLines={1}>
                          {expense.notes}
                        </AppText>
                      </View>
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <AppDeleteModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="حذف الدفعة؟"
        description={`هل أنت متأكد من رغبتك في حذف الدفعة رقم ${batchDetails?.id}؟`}
      />
    </AppScreen>
  );
};

export default BatchDetailPage;
