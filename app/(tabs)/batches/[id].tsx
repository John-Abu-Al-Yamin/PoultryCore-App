import { View, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  Calendar,
  NotebookText,
  Warehouse,
  Edit2,
  Bird,
  Clock,
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
import { useTheme } from "@/src/contexts/ThemeContext";
import { useState } from "react";
import { toast } from "@/src/services/toast";

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

const BatchDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: batch,
    isPending,
    isError,
    refetch,
  } = useGetBatchById(id || "");
  const { mutate: deleteBatch, isPending: isDeleting } = useDeleteBatch();
  const { colors } = useTheme();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const batchDetails = batch?.data?.data;

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
