import { useState } from "react";
import AppError from "@/src/components/custom/AppError";
import AppLoading from "@/src/components/custom/AppLoading";
import AppPagination from "@/src/components/custom/AppPagination";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { Card } from "@/src/components/ui/Card";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useGetAllSuppliers } from "@/src/hooks/Actions/suppliers/useCurdSuppliers";
import type { Supplier } from "@/src/types/api";
import { router } from "expo-router";
import { ChevronLeft, MapPin, Phone, Plus, Truck } from "lucide-react-native";
import { FlatList, Pressable, TouchableOpacity, View, Text } from "react-native";

const SuppliersPage = () => {
  const [page, setPage] = useState(1);
  const { data: suppliers, isPending, isError, isFetching, refetch, pagination } = useGetAllSuppliers(page);
  const { colors } = useTheme();

  const suppliersList: Supplier[] = suppliers?.data?.data || [];

  if (isPending) {
    return (
      <AppScreen
        className="bg-background-light dark:bg-background-dark"
        scrollable={false}
      >
        <AppLoading fullScreen message="بيت حمّل الموردين..." />
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
          message="مقدرناش نحمل قائمة الموردين. تحقق من اتصالك وحاول تاني."
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
        data={suppliersList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 100,
          gap: 16,
        }}
        ListHeaderComponent={
          <View className="flex-row items-center justify-between mb-6">
            <AppText variant="h1">قائمة الموردين</AppText>
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-primary-light dark:bg-primary-dark px-4 py-2 rounded-xl flex-row items-center gap-1.5"
              onPress={() => router.push("/more/suppliers/add")}
            >
              <Plus size={16} color={colors.background} />
              <Text className="text-background-light dark:text-background-dark font-bold text-sm">
                إضافة مورد
              </Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <AppText variant="body" muted className="text-center mt-4">
            مفيش موردين
          </AppText>
        }
        renderItem={({ item: supplier }) => (
          <Pressable
            onPress={() => router.push(`/more/suppliers/${supplier.id}` as any)}
            className="active:opacity-80 active:scale-[0.98] transition-all"
          >
            <Card>
              <View className="p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3.5 flex-1">
                    <View className="w-11 h-11 rounded-[14px] bg-muted-light dark:bg-muted-dark border border-border-light dark:border-border-dark items-center justify-center">
                      <Truck size={20} color={colors.text} />
                    </View>
                    <View className="flex-1 justify-center">
                      <AppText variant="h3" className="leading-tight mb-0.5">
                        {supplier.name}
                      </AppText>
                      <View className="flex-row items-center gap-1.5">
                        <Phone size={13} color={colors.mutedForeground} />
                        <AppText variant="bodySmall" muted numberOfLines={1}>
                          {supplier.phone}
                        </AppText>
                      </View>
                    </View>
                  </View>
                  <View className="w-7 h-7 rounded-full bg-muted-light dark:bg-muted-dark items-center justify-center border border-border-light dark:border-border-dark">
                    <ChevronLeft size={14} color={colors.text} />
                  </View>
                </View>

                {supplier.address && (
                  <View className="flex-row items-center gap-2 mt-3 bg-muted-light dark:bg-muted-dark rounded-[14px] p-2.5 border border-border-light dark:border-border-dark">
                    <MapPin size={14} color={colors.mutedForeground} />
                    <AppText variant="bodySmall" muted numberOfLines={1}>
                      {supplier.address}
                    </AppText>
                  </View>
                )}
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

export default SuppliersPage;
