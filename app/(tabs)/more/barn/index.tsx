import AppError from "@/src/components/custom/AppError";
import AppLoading from "@/src/components/custom/AppLoading";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useGetAllBarns } from "@/src/hooks/Actions/barn/useCurdsBarn";
import { router } from "expo-router";
import { Layers, MapPin, Package } from "lucide-react-native";
import { Pressable, View } from "react-native";

interface Barn {
  id: number;
  name: string;
  location: string;
  capacity: number;
  batches_count: number;
}

const BarnPage = () => {
  const { data: barns, isPending, isError, refetch } = useGetAllBarns();
  const { colors } = useTheme();

  const barnsList: Barn[] = barns?.data?.data || [];

  if (isPending) {
    return (
      <AppScreen
        className="bg-background-light dark:bg-background-dark"
        scrollable={false}
      >
        <AppLoading fullScreen message="جاري تحميل العنابر..." />
      </AppScreen>
    );
  }

  if (isError || !barns) {
    return (
      <AppScreen
        className="bg-background-light dark:bg-background-dark"
        scrollable={false}
      >
        <AppError
          fullScreen
          title="فشل التحميل"
          message="تعذر تحميل قائمة العنابر. تحقق من اتصالك وحاول مرة أخرى."
          onRetry={refetch}
          onBack={() => router.back()}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="px-4 pt-4 pb-8"
    >
      <AppText variant="h1" className="mb-5 text-right">
        قائمة العنابر
      </AppText>

      <View className="gap-4">
        {barnsList.map((barn) => (
          <Pressable
            key={barn.id}
            onPress={() => router.push(`/more/barn/${barn.id}`)}
            className="active:opacity-70"
          >
            <View
              className="bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="p-5">
                <AppText variant="h3" className="text-right mb-3">
                  {barn.name}
                </AppText>

                <View className="flex-row items-center gap-1.5 mb-4">
                  <AppText variant="bodySmall" muted className="text-right">
                    {barn.location}
                  </AppText>
                  <MapPin size={14} color={colors.mutedForeground} />
                </View>

                <View className="border-t border-border-light dark:border-border-dark pt-4">
                  <View className="flex-row justify-between">
                    <View className="flex-row items-center gap-1.5">
                      <Package size={15} color={colors.mutedForeground} />
                      <AppText variant="bodySmall" muted>
                        السعة: {barn.capacity}
                      </AppText>
                    </View>
                    <View className="flex-row items-center gap-1.5">
                      <Layers size={15} color={colors.mutedForeground} />
                      <AppText variant="bodySmall" muted>
                        الدفعات: {barn.batches_count}
                      </AppText>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </AppScreen>
  );
};

export default BarnPage;
