import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  Calendar,
  ChevronRight,
  ClipboardList,
  DollarSign,
  Edit2,
  Home,
  Layers,
  Package,
  ReceiptText,
  Trash2,
} from "lucide-react-native";
import AppDeleteModal from "@/src/components/custom/AppDeleteModal";
import AppError from "@/src/components/custom/AppError";
import AppLoading from "@/src/components/custom/AppLoading";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { Card } from "@/src/components/ui/Card";
import { expenseTypeOptions } from "@/src/constants/expenseTypes";
import { useTheme } from "@/src/contexts/ThemeContext";
import {
  useDeleteExpense,
  useGetExpenseById,
} from "@/src/hooks/Actions/expenses/useCurdExpenses";
import endPoints from "@/src/hooks/EndPoints/endPoints";
import { toast } from "@/src/services/toast";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getExpenseTypeLabel = (type: string) => {
  const option = expenseTypeOptions.find(
    (item) => item.value.toLowerCase() === type.toLowerCase(),
  );

  return option?.label || type;
};

const InfoRow = ({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: string;
}) => {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center justify-between py-3 border-b border-border-light/50 dark:border-border-dark/50 last:border-0">
      <View className="flex-row items-center gap-2.5">
        <View className="w-8 h-8 rounded-lg bg-muted-light dark:bg-muted-dark items-center justify-center">
          <Icon size={16} color={color || colors.mutedForeground} />
        </View>

        <AppText variant="bodySmall" muted>
          {label}
        </AppText>
      </View>

      <AppText className="font-semibold text-right">{value}</AppText>
    </View>
  );
};

const SectionHeader = ({ title, icon: Icon }: { title: string; icon: any }) => {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center gap-2 mb-4">
      <View className="w-1.5 h-6 rounded-full bg-primary-light dark:bg-primary-dark" />
      <Icon size={18} color={colors.text} />
      <AppText variant="h3">{title}</AppText>
    </View>
  );
};

export default function ExpenseDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    data: expenseResponse,
    isPending,
    isError,
    refetch,
  } = useGetExpenseById(id || "");
  const { mutate: deleteExpense, isPending: isDeleting } = useDeleteExpense();

  const expense = expenseResponse?.data?.data;

  const handleDelete = () => {
    deleteExpense(
      { id: id as string, url: `${endPoints.expenses}/${id}` },
      {
        onSuccess: () => {
          setShowDeleteModal(false);
          toast.success("تم حذف المصروف بنجاح");
          router.replace("/finance/expenses");
        },
        onError: (error: any) => {
          setShowDeleteModal(false);
          const errorMessage =
            error?.response?.data?.message || "فشل في حذف المصروف";
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
        <AppLoading fullScreen message="جاري تحميل المصروف..." />
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
          message="تعذر تحميل بيانات المصروف."
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
        <View className="flex-row items-start justify-between mb-6">
          <View className="flex-1">
            <AppText
              variant="caption"
              muted
              className="mb-1 uppercase tracking-wider"
            >
              رقم المصروف #{expense?.id}
            </AppText>
            <AppText variant="h1" className="mb-2">
              {Number(expense?.amount || 0).toLocaleString()} ج.م
            </AppText>
            <View className="flex-row items-center gap-2">
              <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                <ReceiptText size={13} color="#f59e0b" />
                <AppText className="text-[12px] font-bold text-amber-600 dark:text-amber-400">
                  {getExpenseTypeLabel(expense?.type || "")}
                </AppText>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Calendar size={14} color={colors.mutedForeground} />
                <AppText variant="caption" muted>
                  {formatDate(expense?.date || "")}
                </AppText>
              </View>
            </View>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => router.push(`/finance/expenses/edit/${id}` as any)}
              className="w-11 h-11 rounded-2xl items-center justify-center bg-primary-light/10 dark:bg-primary-dark/10 border border-primary-light/20 dark:border-primary-dark/20"
            >
              <Edit2 size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowDeleteModal(true)}
              className="w-11 h-11 rounded-2xl items-center justify-center bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20"
            >
              <Trash2 size={20} color="#f43f5e" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-primary-light dark:bg-primary-dark rounded-[32px] p-6 mb-8 shadow-xl">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <AppText inverse variant="caption" className="opacity-70 mb-1">
                قيمة المصروف
              </AppText>
              <AppText inverse className="text-3xl font-bold">
                {Number(expense?.amount || 0).toLocaleString()}{" "}
                <AppText inverse variant="bodySmall" className="opacity-70">
                  ج.م
                </AppText>
              </AppText>
            </View>
            <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center">
              <DollarSign size={24} color="white" />
            </View>
          </View>

          <View className="h-[1px] bg-white/10 mb-4" />

          <View className="flex-row items-center gap-2">
            <View className="w-2 h-2 rounded-full bg-amber-300" />
            <AppText inverse variant="caption" className="opacity-70">
              {getExpenseTypeLabel(expense?.type || "")}
            </AppText>
          </View>
        </View>

        <SectionHeader title="تفاصيل المصروف" icon={ReceiptText} />
        <Card className="p-4 mb-6">
          <InfoRow
            label="نوع المصروف"
            value={getExpenseTypeLabel(expense?.type || "")}
            icon={ReceiptText}
            color="#f59e0b"
          />
          <InfoRow
            label="التاريخ"
            value={formatDate(expense?.date || "")}
            icon={Calendar}
            color={colors.primary}
          />
          <InfoRow
            label="المبلغ"
            value={`${Number(expense?.amount || 0).toLocaleString()} ج.م`}
            icon={DollarSign}
          />
          {expense?.notes && (
            <InfoRow
              label="ملاحظات"
              value={expense.notes}
              icon={ClipboardList}
            />
          )}
        </Card>

        <SectionHeader title="الدفعة المرتبطة" icon={Layers} />
        <Card className="p-4 mb-6">
          <TouchableOpacity
            onPress={() => router.push(`/batches/${expense?.batch_id}` as any)}
            className="flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-3 flex-1">
              <View className="w-12 h-12 rounded-full bg-primary-light/5 dark:bg-primary-dark/5 items-center justify-center">
                <Package size={22} color={colors.primary} />
              </View>
              <View className="flex-1">
                <AppText className="font-bold text-lg" numberOfLines={1}>
                  {expense?.batch?.poultry_type || "---"}
                </AppText>
                <View className="flex-row items-center gap-2 mt-1">
                  <Home size={13} color={colors.mutedForeground} />
                  <AppText variant="caption" muted>
                    الحظيرة #{expense?.batch?.barn_id || "---"} - الكمية{" "}
                    {expense?.batch?.current_quantity ?? "---"}
                  </AppText>
                </View>
              </View>
            </View>
            <ChevronRight size={20} color={colors.text} />
          </TouchableOpacity>
        </Card>
      </ScrollView>

      <AppDeleteModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="حذف المصروف؟"
        description={`هل أنت متأكد من رغبتك في حذف مصروف "${getExpenseTypeLabel(
          expense?.type || "",
        )}"؟`}
      />
    </AppScreen>
  );
}
