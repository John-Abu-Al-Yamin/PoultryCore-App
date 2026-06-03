import { View, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Calendar, MapPin, NotebookText, Warehouse, Edit2, Bird, Layers, Clock, Activity } from "lucide-react-native";
import AppError from "@/src/components/custom/AppError";
import AppLoading from "@/src/components/custom/AppLoading";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { Card } from "@/src/components/ui/Card";
import { useGetBarnById } from "@/src/hooks/Actions/barn/useCurdsBarn";
import { useTheme } from "@/src/contexts/ThemeContext";
import type { Batch } from "@/src/types/api";

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
    badgeClass: "bg-gray-200 dark:bg-gray-800 border border-border-light dark:border-border-dark",
    textClass: "text-mutedForeground-light dark:text-mutedForeground-dark",
  },
};

const poultryLabels: Record<string, string> = {
  chick: "كتاكيت",
  duck: "بط",
};

const BarnDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: barn, isPending, isError, refetch } = useGetBarnById(id || "");
  const { colors } = useTheme();

  const branDetails = barn?.data?.data;




  if (isPending) {
    return (
      <AppScreen
        className="bg-background-light dark:bg-background-dark"
        scrollable={false}
      >
        <AppLoading fullScreen message="جاري تحميل العنبر..." />
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
          message="تعذر تحميل بيانات العنبر."
          onRetry={refetch}
          onBack={() => router.back()}
        />
      </AppScreen>
    );
  }

  const batches = branDetails?.batches ?? [];

  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="px-4 pt-6 pb-12"
    >
      {/* Header */}
      <View className="flex-row items-start justify-between mb-6">
        <View className="flex-1">
          <AppText variant="h1" className="mb-2">
            {branDetails?.name}
          </AppText>
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1.5">
              <MapPin size={14} color={colors.mutedForeground} />
              <AppText variant="bodySmall" muted>
                {branDetails?.location}
              </AppText>
            </View>
            <View className="flex-row items-center gap-1.5">
              <Calendar size={14} color={colors.mutedForeground} />
              <AppText variant="bodySmall" muted>
                {formatDate(branDetails?.created_at || "")}
              </AppText>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push(`/more/barn/edit/${id}`)}
          className="w-10 h-10 rounded-[14px] bg-muted-light dark:bg-muted-dark border border-border-light dark:border-border-dark items-center justify-center"
        >
          <Edit2 size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Main Stats Row */}
      <View className="flex-row gap-3 mb-6">
        <View className="flex-1 bg-primary-light dark:bg-primary-dark rounded-[24px] p-5 shadow-sm">
          <View className="w-10 h-10 rounded-full bg-white/20 dark:bg-black/10 items-center justify-center mb-4 shadow-sm">
            <Bird size={20} color={colors.background} />
          </View>
          <AppText inverse className="mb-1 text-xs">
            السعة الإجمالية
          </AppText>
          <View className="flex-row items-baseline gap-1">
            <AppText inverse className="font-bold text-2xl ">
              {branDetails?.capacity?.toLocaleString()}
            </AppText>
            <AppText inverse className=" text-xs">
              طائر
            </AppText>
          </View>
        </View>

        <View className="flex-1 bg-muted-light dark:bg-muted-dark rounded-[24px] p-5 border border-border-light dark:border-border-dark shadow-sm">
          <View className="w-10 h-10 rounded-full bg-background-light dark:bg-background-dark items-center justify-center mb-4 shadow-sm">
            <Layers size={20} color={colors.text} />
          </View>
          <AppText variant="caption" muted className="mb-1">
            عدد الدفعات
          </AppText>
          <View className="flex-row items-baseline gap-1">
            <AppText className="font-bold text-2xl text-text-light dark:text-text-dark">
              {batches.length}
            </AppText>
            <AppText variant="caption" muted>
              {batches.length === 1 ? "دفعة" : "دفعات"}
            </AppText>
          </View>
        </View>
      </View>

      {/* Notes Section */}
      {branDetails?.notes && (
        <Card className="mb-8">
          <View className="p-4 flex-row gap-3">
            <View className="mt-0.5">
              <NotebookText size={18} color={colors.mutedForeground} />
            </View>
            <View className="flex-1">
              <AppText variant="label" className="mb-1">
                ملاحظات
              </AppText>
              <AppText variant="bodySmall" muted className="leading-relaxed">
                {branDetails.notes}
              </AppText>
            </View>
          </View>
        </Card>
      )}

      {/* Batches Section */}
      <View className="mb-4 flex-row items-center justify-between">
        <AppText variant="h2">الدفعات</AppText>
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-muted-light dark:bg-muted-dark px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark"
        >
          <AppText variant="caption" className="font-bold">عرض الكل</AppText>
        </TouchableOpacity>
      </View>

      {batches.length === 0 ? (
        <View className="py-10 items-center justify-center bg-muted-light dark:bg-muted-dark rounded-[24px] border border-dashed border-border-light dark:border-border-dark">
          <Warehouse size={32} color={colors.mutedForeground} className="mb-3 opacity-50" />
          <AppText variant="body" muted>لا توجد دفعات حالياً</AppText>
        </View>
      ) : (
        <View className="gap-4">
          {batches.map((batch: Batch) => {
            const status = statusConfig[batch.status] || statusConfig.closed;
            const poultryLabel = poultryLabels[batch.poultry_type] || batch.poultry_type;

            return (
              <Card key={batch.id}>
                <View className="p-4">
                  {/* Batch Header */}
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center gap-2">
                      <View className="w-8 h-8 rounded-full bg-background-light dark:bg-background-dark items-center justify-center border border-border-light dark:border-border-dark shadow-sm">
                        <Activity size={14} color={colors.text} />
                      </View>
                      <AppText variant="h3">دفعة #{batch.id}</AppText>
                    </View>
                    <View className={`px-2.5 py-1 rounded-md ${status.badgeClass}`}>
                      <AppText className={`text-[10px] font-bold ${status.textClass}`}>
                        {status.label}
                      </AppText>
                    </View>
                  </View>

                  {/* Batch Details Grid */}
                  <View className="bg-muted-light dark:bg-muted-dark rounded-xl p-3 flex-row mb-4 border border-border-light dark:border-border-dark">
                    <View className="flex-1">
                      <AppText variant="caption" muted className="mb-1">النوع</AppText>
                      <AppText className="font-bold text-sm text-text-light dark:text-text-dark">
                        {poultryLabel}
                      </AppText>
                    </View>
                    <View className="w-[1px] bg-border-light dark:bg-border-dark mx-3" />
                    <View className="flex-1">
                      <AppText variant="caption" muted className="mb-1">الكمية الحالية</AppText>
                      <AppText className="font-bold text-sm text-text-light dark:text-text-dark">
                        {batch.current_quantity?.toLocaleString()}
                      </AppText>
                    </View>
                  </View>

                  {/* Dates */}
                  <View className="flex-row items-center gap-4">
                    <View className="flex-row items-center gap-1.5 flex-1">
                      <Clock size={14} color={colors.mutedForeground} />
                      <AppText variant="caption" muted>
                        من: {formatDate(batch.start_date)}
                      </AppText>
                    </View>
                    <View className="flex-row items-center gap-1.5 flex-1">
                      <Clock size={14} color={colors.mutedForeground} />
                      <AppText variant="caption" muted>
                        إلى: {formatDate(batch.end_date)}
                      </AppText>
                    </View>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>
      )}
    </AppScreen>
  );
};

export default BarnDetailPage;
