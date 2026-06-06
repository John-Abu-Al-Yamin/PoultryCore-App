import AppError from "@/src/components/custom/AppError";
import AppLoading from "@/src/components/custom/AppLoading";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { Card } from "@/src/components/ui/Card";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useGetAllCustomers } from "@/src/hooks/Actions/customers/useCurdCustomers";
import type { Customer } from "@/src/types/api";
import { router } from "expo-router";
import { ChevronLeft, MapPin, Phone, Plus, User } from "lucide-react-native";
import { FlatList, Pressable, TouchableOpacity, View, Text } from "react-native";

const CustomersPage = () => {
  const { data: customers, isPending, isError, refetch } = useGetAllCustomers();
  const { colors } = useTheme();

  const customersList: Customer[] = customers?.data?.data || [];

  if (isPending) {
    return (
      <AppScreen
        className="bg-background-light dark:bg-background-dark"
        scrollable={false}
      >
        <AppLoading fullScreen message="جاري تحميل العملاء..." />
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
          message="تعذر تحميل قائمة العملاء. تحقق من اتصالك وحاول مرة أخرى."
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
        data={customersList}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 100,
          gap: 16,
        }}
        ListHeaderComponent={
          <View className="flex-row items-center justify-between mb-6">
            <AppText variant="h1">قائمة العملاء</AppText>
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-primary-light dark:bg-primary-dark px-4 py-2 rounded-xl flex-row items-center gap-1.5"
              onPress={() => router.push("/more/customers/add")}
            >
              <Plus size={16} color={colors.background} />
              <Text className="text-background-light dark:text-background-dark font-bold text-sm">
                إضافة عميل
              </Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <AppText variant="body" muted className="text-center mt-4">
            لا توجد عملاء
          </AppText>
        }
        renderItem={({ item: customer }) => (
          <Pressable
            onPress={() => router.push(`/more/customers/${customer.id}` as any)}
            className="active:opacity-80 active:scale-[0.98] transition-all"
          >
            <Card>
              <View className="p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3.5 flex-1">
                    <View className="w-11 h-11 rounded-[14px] bg-muted-light dark:bg-muted-dark border border-border-light dark:border-border-dark items-center justify-center">
                      <User size={20} color={colors.text} />
                    </View>
                    <View className="flex-1 justify-center">
                      <AppText variant="h3" className="leading-tight mb-0.5">
                        {customer.name}
                      </AppText>
                      <View className="flex-row items-center gap-1.5">
                        <Phone size={13} color={colors.mutedForeground} />
                        <AppText variant="bodySmall" muted numberOfLines={1}>
                          {customer.phone}
                        </AppText>
                      </View>
                    </View>
                  </View>
                  <View className="w-7 h-7 rounded-full bg-muted-light dark:bg-muted-dark items-center justify-center border border-border-light dark:border-border-dark">
                    <ChevronLeft size={14} color={colors.text} />
                  </View>
                </View>

                {customer.address && (
                  <View className="flex-row items-center gap-2 mt-3 bg-muted-light dark:bg-muted-dark rounded-[14px] p-2.5 border border-border-light dark:border-border-dark">
                    <MapPin size={14} color={colors.mutedForeground} />
                    <AppText variant="bodySmall" muted numberOfLines={1}>
                      {customer.address}
                    </AppText>
                  </View>
                )}
              </View>
            </Card>
          </Pressable>
        )}
      />
    </AppScreen>
  );
};

export default CustomersPage;
