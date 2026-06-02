import { Pressable, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  MapPin,
  Package,
  Layers,
  Warehouse,
  FileText,
  ArrowRight,
  Calendar,
} from "lucide-react-native";
import AppError from "@/src/components/custom/AppError";
import AppLoading from "@/src/components/custom/AppLoading";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { useGetBarnById } from "@/src/hooks/Actions/barn/useCurdsBarn";
import { useTheme } from "@/src/contexts/ThemeContext";
import type { Batch } from "@/src/types/api";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStatusStyle = (status: string, colors: Record<string, string>) => {
  switch (status) {
    case "active":
      return { backgroundColor: colors.success };
    case "completed":
      return { backgroundColor: colors.mutedForeground };
    case "cancelled":
      return { backgroundColor: colors.error };
    default:
      return { backgroundColor: colors.mutedForeground };
  }
};

const statusLabels: Record<string, string> = {
  active: "نشط",
  completed: "مكتمل",
  cancelled: "ملغي",
};

const poultryLabels: Record<string, string> = {
  chick: "كتاكيت",
  duck: "بط",
  turkey: "ديك رومي",
  goose: "إوز",
  quail: "سمان",
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

  if (isError || !branDetails) {
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

  const batches: Batch[] = branDetails.batches || [];
  const uniquePoultryTypes = [
    ...new Set(batches.map((b) => b.poultry_type)),
  ];

  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="px-4 pt-4 pb-8"
    >
      <Pressable
        onPress={() => router.back()}
        className="flex-row items-center gap-2 mb-4 active:opacity-70"
      >
        <View className="w-9 h-9 rounded-xl bg-secondary-light dark:bg-secondary-dark border border-border-light dark:border-border-dark items-center justify-center">
          <ArrowRight size={18} color={colors.text} />
        </View>
        <AppText variant="body" muted>رجوع</AppText>
      </Pressable>

      <View
        className="bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden mb-5"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View className="p-6 items-center">
          <View className="w-16 h-16 rounded-2xl bg-primary-light dark:bg-primary-dark items-center justify-center mb-4">
            <Warehouse size={30} color={colors.card} />
          </View>
          <AppText variant="h1" className="text-center mb-1">
            {branDetails.name}
          </AppText>
          <View className="flex-row items-center gap-1.5">
            <MapPin size={14} color={colors.mutedForeground} />
            <AppText variant="body" muted>
              {branDetails.location}
            </AppText>
          </View>
        </View>
      </View>

      <View className="flex-row gap-3 mb-5">
        <View className="flex-1 bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark p-4 items-center">
          <Package size={20} color={colors.mutedForeground} />
          <AppText variant="h3" className="mt-2">
            {branDetails.capacity}
          </AppText>
          <AppText variant="caption" muted>السعة</AppText>
        </View>
        <View className="flex-1 bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark p-4 items-center">
          <Layers size={20} color={colors.mutedForeground} />
          <AppText variant="h3" className="mt-2">
            {batches.length}
          </AppText>
          <AppText variant="caption" muted>الدفعات</AppText>
        </View>
        <View className="flex-1 bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark p-4 items-center">
          <FileText size={20} color={colors.mutedForeground} />
          <AppText variant="h3" className="mt-2">
            {uniquePoultryTypes.length}
          </AppText>
          <AppText variant="caption" muted>الأنواع</AppText>
        </View>
      </View>

      <View className="bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden mb-5">
        <View className="p-5">
          <AppText variant="h3" className="mb-4">معلومات العنبر</AppText>
          <DetailRow
            label="الاسم"
            value={branDetails.name}
          />
          <DetailRow
            label="الموقع"
            value={branDetails.location}
          />
          <DetailRow
            label="السعة"
            value={String(branDetails.capacity)}
          />
          {branDetails.notes && (
            <DetailRow
              label="ملاحظات"
              value={branDetails.notes}
            />
          )}
          <DetailRow
            label="تاريخ الإنشاء"
            value={formatDate(branDetails.created_at)}
            isLast
          />
        </View>
      </View>

      {batches.length > 0 ? (
        <View>
          <AppText variant="h3" className="mb-4">
            الدفعات ({batches.length})
          </AppText>
          {batches.map((batch) => (
            <View
              key={batch.id}
              className="bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden mb-3"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
                elevation: 1,
              }}
            >
              <View className="p-5">
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-row items-center gap-2">
                    <View
                      className="w-2.5 h-2.5 rounded-full"
                      style={getStatusStyle(batch.status, colors)}
                    />
                    <AppText variant="bodySmall" muted>
                      {statusLabels[batch.status] || batch.status}
                    </AppText>
                  </View>
                  <AppText variant="h3" className="text-right flex-1 mr-4">
                    {poultryLabels[batch.poultry_type] || batch.poultry_type}
                  </AppText>
                </View>
                <View className="border-t border-border-light dark:border-border-dark pt-3">
                  <View className="flex-row justify-between items-center mb-1.5">
                    <View className="flex-row items-center gap-1.5">
                      <Layers size={14} color={colors.mutedForeground} />
                      <AppText variant="bodySmall" muted>
                        الكمية: {batch.current_quantity}
                      </AppText>
                    </View>
                    <View className="flex-row items-center gap-1.5">
                      <Calendar size={14} color={colors.mutedForeground} />
                      <AppText variant="bodySmall" muted>
                        {formatDate(batch.start_date)}
                      </AppText>
                    </View>
                  </View>
                  <View className="flex-row justify-between items-center mt-1.5">
                    <View className="flex-row items-center gap-1">
                      <Calendar size={14} color={colors.mutedForeground} />
                      <AppText variant="bodySmall" muted>
                        {formatDate(batch.end_date)}
                      </AppText>
                    </View>
                  </View>
                  {batch.notes && (
                    <View className="border-t border-border-light dark:border-border-dark mt-3 pt-3">
                      <AppText variant="bodySmall" muted className="text-right">
                        {batch.notes}
                      </AppText>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className="bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark p-6 items-center mb-5">
          <Layers size={32} color={colors.mutedForeground} />
          <AppText variant="body" muted className="mt-3 text-center">
            لا توجد دفعات لهذا العنبر
          </AppText>
        </View>
      )}
    </AppScreen>
  );
};

const DetailRow = ({
  label,
  value,
  isLast,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) => (
  <View
    className={`flex-row justify-between items-center py-3 ${
      isLast ? "" : "border-b border-border-light dark:border-border-dark"
    }`}
  >
    <AppText variant="bodySmall" muted>
      {label}
    </AppText>
    <AppText variant="body">
      {value}
    </AppText>
  </View>
);

export default BarnDetailPage;
