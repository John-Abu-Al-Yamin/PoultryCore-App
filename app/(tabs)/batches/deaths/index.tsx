import { useState } from "react";
import AppError from "@/src/components/custom/AppError";
import AppLoading from "@/src/components/custom/AppLoading";
import AppPagination from "@/src/components/custom/AppPagination";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { Card } from "@/src/components/ui/Card";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useGetAllDeaths } from "@/src/hooks/Actions/deaths/useCurdDeaths";
import type { Death } from "@/src/types/api";
import { router } from "expo-router";
import {
  Bird,
  Calendar,
  ChevronLeft,
  ClipboardList,
  Plus,
  Skull,
} from "lucide-react-native";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
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

export default function DeathsPage() {
  const [page, setPage] = useState(1);
  const { data: deaths, isPending, isError, isFetching, refetch, pagination } = useGetAllDeaths(page);
  const { colors } = useTheme();

  const deathsRaw = deaths?.data?.data;
  const deathsList: Death[] = Array.isArray(deathsRaw) ? deathsRaw : [];

  if (isPending) {
    return (
      <AppScreen
        className="bg-background-light dark:bg-background-dark"
        scrollable={false}
      >
        <AppLoading fullScreen message="بيت حمّل حالات النفوق..." />
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
          title="حصل خطأ في التحميل"
          message="مقدرناش نحمل قائمة النفوق."
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
            <AppText variant="h1">النفوق</AppText>
            <AppText variant="bodySmall" muted className="mt-1">
              تسجيل ومتابعة حالات النفوق
            </AppText>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-primary-light dark:bg-primary-dark px-4 py-2 rounded-xl flex-row items-center gap-1.5"
            onPress={() => router.push("/batches/deaths/add")}
          >
            <Plus size={16} color={colors.background} />
            <Text className="text-background-light dark:text-background-dark font-bold text-sm">
              إضافة نفوق
            </Text>
          </TouchableOpacity>
        </View>

        {deathsList.length === 0 ? (
          <View className="bg-muted-light dark:bg-muted-dark rounded-2xl p-8 items-center justify-center border border-dashed border-border-light dark:border-border-dark mt-4">
            <Skull size={34} color={colors.mutedForeground} />
            <AppText muted className="mt-3 text-center">
              مفيش حالات نفوق مسجلة
            </AppText>
          </View>
        ) : (
          <View className="gap-4">
            {deathsList?.map((death) => (
              <Pressable
                key={death.id}
                onPress={() =>
                  router.push(`/batches/deaths/${death.id}` as any)
                }
                className="active:opacity-80 active:scale-[0.98] transition-all"
              >
                <Card>
                  <View className="p-4">
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center gap-3.5 flex-1">
                        <View className="w-11 h-11 rounded-[14px] bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 items-center justify-center">
                          <Skull size={20} color="#ef4444" />
                        </View>
                        <View className="flex-1 justify-center">
                          <View className="flex-row items-center gap-1.5 mb-0.5">
                            <AppText variant="h3" numberOfLines={1}>
                              {Number(death.quantity).toLocaleString()} طائر
                            </AppText>
                            <View className="px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20">
                              <AppText className="text-[10px] font-bold text-red-600 dark:text-red-400">
                                {death.reason}
                              </AppText>
                            </View>
                          </View>
                          <AppText variant="bodySmall" muted numberOfLines={1}>
                            {death.batch?.poultry_type || "---"}
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
                          <AppText
                            variant="caption"
                            muted
                            className="mb-[2px] text-[10px]"
                          >
                            التاريخ
                          </AppText>
                          <AppText className="font-bold text-sm leading-tight">
                            {formatDate(death.date)}
                          </AppText>
                        </View>
                      </View>

                      <View className="flex-1 flex-row items-center bg-muted-light dark:bg-muted-dark rounded-[14px] p-2.5 border border-border-light dark:border-border-dark gap-2.5">
                        <View className="w-7 h-7 rounded-full bg-background-light dark:bg-background-dark items-center justify-center shadow-sm">
                          <Bird size={14} color={colors.text} />
                        </View>
                        <View className="flex-1">
                          <AppText
                            variant="caption"
                            muted
                            className="mb-[2px] text-[10px]"
                          >
                            الدفعة
                          </AppText>
                          <AppText
                            className="font-bold text-sm leading-tight"
                            numberOfLines={1}
                          >
                            {death.batch?.poultry_type}
                          </AppText>
                        </View>
                      </View>
                    </View>

                    {death.notes && (
                      <View className="mt-3 pt-3 border-t border-border-light/50 dark:border-border-dark/50 flex-row items-center gap-2">
                        <ClipboardList
                          size={14}
                          color={colors.mutedForeground}
                        />
                        <AppText variant="caption" muted numberOfLines={1}>
                          {death.notes}
                        </AppText>
                      </View>
                    )}
                  </View>
                </Card>
              </Pressable>
            ))}
          </View>
        )}

        {pagination && (
          <AppPagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            total={pagination.total}
            from={pagination.from}
            to={pagination.to}
            isLoading={isFetching}
            onPageChange={setPage}
          />
        )}
      </ScrollView>
    </AppScreen>
  );
}
