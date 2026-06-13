import { useState } from "react";
import AppError from "@/src/components/custom/AppError";
import AppLoading from "@/src/components/custom/AppLoading";
import AppPagination from "@/src/components/custom/AppPagination";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { Card } from "@/src/components/ui/Card";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useGetAllBarns } from "@/src/hooks/Actions/barn/useCurdsBarn";
import type { BarnListItem as Barn } from "@/src/types/api";
import { router } from "expo-router";
import {
    Bird,
    ChevronLeft,
    Layers,
    MapPin,
    Plus,
    Warehouse,
} from "lucide-react-native";
import { FlatList, Pressable, TouchableOpacity, View, Text } from "react-native";

const BarnPage = () => {
  const [page, setPage] = useState(1);
  const { data: barns, isPending, isError, isFetching, refetch, pagination } = useGetAllBarns(page);
  const { colors } = useTheme();

  const barnsList: Barn[] = barns?.data?.data || [];

  if (isPending) {
    return (
      <AppScreen
        className="bg-background-light dark:bg-background-dark"
        scrollable={false}
      >
        <AppLoading fullScreen message="بيت حمّل العنابر..." />
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
          message="مقدرناش نحمل قائمة العنابر. تحقق من اتصالك وحاول تاني."
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
        data={barnsList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ 
          paddingHorizontal: 16, 
          paddingTop: 16, 
          paddingBottom: 100,
          gap: 16 
        }}
        ListHeaderComponent={
          <View className="flex-row items-center justify-between mb-6">
            <AppText variant="h1">قائمة العنابر</AppText>
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-primary-light dark:bg-primary-dark px-4 py-2 rounded-xl flex-row items-center gap-1.5"
              onPress={() => router.push("/more/barn/add")}
            >
              <Plus size={16} color={colors.background} />
              <Text className="text-background-light dark:text-background-dark font-bold text-sm">
                إضافة عنبر
              </Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <AppText variant="body" muted className="text-center mt-4">
            مفيش عنابر
          </AppText>
        }
        renderItem={({ item: barn }) => (
          <Pressable
            onPress={() => router.push(`/more/barn/${barn.id}`)}
            className="active:opacity-80 active:scale-[0.98] transition-all"
          >
            <Card>
              <View className="p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3.5 flex-1">
                    <View className="w-11 h-11 rounded-[14px] bg-muted-light dark:bg-muted-dark border border-border-light dark:border-border-dark items-center justify-center">
                      <Warehouse size={20} color={colors.text} />
                    </View>
                    <View className="flex-1 justify-center">
                      <AppText variant="h3" className="leading-tight mb-0.5">
                        {barn.name}
                      </AppText>
                      <View className="flex-row items-center gap-1.5">
                        <MapPin size={13} color={colors.mutedForeground} />
                        <AppText variant="bodySmall" muted numberOfLines={1}>
                          {barn.location}
                        </AppText>
                      </View>
                    </View>
                  </View>
                  <View className="w-7 h-7 rounded-full bg-muted-light dark:bg-muted-dark items-center justify-center border border-border-light dark:border-border-dark">
                    <ChevronLeft size={14} color={colors.text} />
                  </View>
                </View>

                <View className="flex-row gap-3 mt-4">
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
                        السعة
                      </AppText>
                      <View className="flex-row items-baseline gap-1">
                        <AppText className="font-bold text-sm leading-tight">
                          {barn.capacity.toLocaleString()}
                        </AppText>
                        <AppText
                          variant="caption"
                          muted
                          className="text-[10px]"
                        >
                          طائر
                        </AppText>
                      </View>
                    </View>
                  </View>

                  <View className="flex-1 flex-row items-center bg-muted-light dark:bg-muted-dark rounded-[14px] p-2.5 border border-border-light dark:border-border-dark gap-2.5">
                    <View className="w-7 h-7 rounded-full bg-background-light dark:bg-background-dark items-center justify-center shadow-sm">
                      <Layers size={14} color={colors.text} />
                    </View>
                    <View className="flex-1">
                      <AppText
                        variant="caption"
                        muted
                        className="mb-[2px] text-[10px]"
                      >
                        الدفعات
                      </AppText>
                      <View className="flex-row items-baseline gap-1">
                        <AppText className="font-bold text-sm leading-tight">
                          {barn.batches_count}
                        </AppText>
                        <AppText
                          variant="caption"
                          muted
                          className="text-[10px]"
                        >
                          {barn.batches_count === 1 ? "دفعة" : "دفعات"}
                        </AppText>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Card>
          </Pressable>
        )}
        ListFooterComponent={
          pagination ? (
            <AppPagination
              currentPage={pagination.current_page}
              lastPage={pagination.last_page}
              total={pagination.total}
              from={pagination.from}
              to={pagination.to}
              isLoading={isFetching}
              onPageChange={setPage}
            />
          ) : null
        }
      />
    </AppScreen>
  );
};

export default BarnPage;
