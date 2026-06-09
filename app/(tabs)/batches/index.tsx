import AppError from "@/src/components/custom/AppError";
import AppLoading from "@/src/components/custom/AppLoading";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { Card } from "@/src/components/ui/Card";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useGetAllBatches } from "@/src/hooks/Actions/batch/useCurdBatch";
import type { Batch } from "@/src/types/api";
import { router } from "expo-router";
import {
  Bird,
  Clock,
  Layers,
  Plus,
  Skull,
  Warehouse,
} from "lucide-react-native";
import { FlatList, Pressable, TouchableOpacity, View, Text } from "react-native";

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

const BatchesPage = () => {
  const { data: batches, isPending, isError, refetch } = useGetAllBatches();
  const { colors } = useTheme();

  const batchesList: Batch[] = batches?.data?.data || [];

  console.log("batches:", batchesList);

  if (isPending) {
    return (
      <AppScreen
        className="bg-background-light dark:bg-background-dark"
        scrollable={false}
      >
        <AppLoading fullScreen message="جاري تحميل الدفعات..." />
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
          message="تعذر تحميل قائمة الدفعات. تحقق من اتصالك وحاول مرة أخرى."
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
        data={batchesList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 100,
          gap: 16,
        }}
        ListHeaderComponent={
          <View className="flex-row items-center justify-between mb-6">
            <AppText variant="h1">الدفعات</AppText>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                activeOpacity={0.8}
                className="bg-error-light/10 dark:bg-error-dark/10 border border-error-light/20 dark:border-error-dark/20 px-3 py-2 rounded-xl flex-row items-center gap-1.5"
                onPress={() => router.push("/batches/deaths")}
              >
                <Skull size={16} color="#ef4444" />
                <Text className="text-error-light dark:text-error-dark font-bold text-sm">
                  النفوق
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                className="bg-primary-light dark:bg-primary-dark px-4 py-2 rounded-xl flex-row items-center gap-1.5"
                onPress={() => router.push("/batches/add")}
              >
                <Plus size={16} color={colors.background} />
                <Text className="text-background-light dark:text-background-dark font-bold text-sm">
                  إضافة دفعة
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={
          <AppText variant="body" muted className="text-center mt-4">
            لا توجد دفعات
          </AppText>
        }
        renderItem={({ item: batch }) => {
          const status = statusConfig[batch.status] || statusConfig.closed;
          const poultryLabel =
            poultryLabels[batch.poultry_type] || batch.poultry_type;

          return (
            <Pressable
              onPress={() => router.push(`/batches/${batch.id}` as any)}
              className="active:opacity-80 active:scale-[0.98] transition-all"
            >
              <Card>
                <View className="p-4">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-3.5 flex-1">
                      <View className="w-11 h-11 rounded-[14px] bg-muted-light dark:bg-muted-dark border border-border-light dark:border-border-dark items-center justify-center">
                        <Layers size={20} color={colors.text} />
                      </View>
                      <View className="flex-1 justify-center">
                        <AppText variant="h3" className="leading-tight mb-0.5">
                          {poultryLabel}
                        </AppText>
                        <View className="flex-row items-center gap-1.5">
                          <Warehouse size={13} color={colors.mutedForeground} />
                          <AppText variant="bodySmall" muted numberOfLines={1}>
                            عنبر #{batch.barn_id}
                          </AppText>
                        </View>
                      </View>
                    </View>
                    <View className={`px-2.5 py-1 rounded-md ${status.badgeClass}`}>
                      <AppText className={`text-[10px] font-bold ${status.textClass}`}>
                        {status.label}
                      </AppText>
                    </View>
                  </View>

                  <View className="flex-row gap-3">
                    <View className="flex-1 flex-row items-center bg-muted-light dark:bg-muted-dark rounded-[14px] p-2.5 border border-border-light dark:border-border-dark gap-2.5">
                      <View className="w-7 h-7 rounded-full bg-background-light dark:bg-background-dark items-center justify-center shadow-sm">
                        <Bird size={14} color={colors.text} />
                      </View>
                      <View className="flex-1">
                        <AppText variant="caption" muted className="mb-[2px] text-[10px]">
                          الكمية
                        </AppText>
                        <View className="flex-row items-baseline gap-1">
                          <AppText className="font-bold text-sm leading-tight">
                            {batch.current_quantity.toLocaleString()}
                          </AppText>
                          <AppText variant="caption" muted className="text-[10px]">
                            طائر
                          </AppText>
                        </View>
                      </View>
                    </View>

                    <View className="flex-1 flex-row items-center bg-muted-light dark:bg-muted-dark rounded-[14px] p-2.5 border border-border-light dark:border-border-dark gap-2.5">
                      <View className="w-7 h-7 rounded-full bg-background-light dark:bg-background-dark items-center justify-center shadow-sm">
                        <Clock size={14} color={colors.text} />
                      </View>
                      <View className="flex-1">
                        <AppText variant="caption" muted className="mb-[2px] text-[10px]">
                          تاريخ البداية
                        </AppText>
                        <AppText className="font-bold text-sm leading-tight">
                          {formatDate(batch.start_date)}
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

export default BatchesPage;
