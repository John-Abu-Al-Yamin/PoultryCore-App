import { View, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Calendar, MapPin, Phone, Edit2, Trash2 } from "lucide-react-native";
import AppError from "@/src/components/custom/AppError";
import AppLoading from "@/src/components/custom/AppLoading";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import AppDeleteModal from "@/src/components/custom/AppDeleteModal";
import { Card } from "@/src/components/ui/Card";
import {
  useGetCustomerById,
  useDeleteCustomer,
} from "@/src/hooks/Actions/customers/useCurdCustomers";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useState } from "react";
import { toast } from "@/src/services/toast";
import endPoints from "@/src/hooks/EndPoints/endPoints";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const CustomerDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: customer, isPending, isError, refetch } = useGetCustomerById(id || "");
  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();
  const { colors } = useTheme();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const customerDetails = customer?.data?.data;

  const handleDelete = () => {
    deleteCustomer(
      { id: id as string, url: `${endPoints.customers}/${id}` },
      {
        onSuccess: () => {
          setShowDeleteModal(false);
          toast.success("تم حذف العميل بنجاح");
          router.replace("/more/customers");
        },
        onError: (error: any) => {
          setShowDeleteModal(false);
          const errorMessage = error?.response?.data?.message || "فشل في حذف العميل";
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
        <AppLoading fullScreen message="جاري تحميل العميل..." />
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
          message="تعذر تحميل بيانات العميل."
          onRetry={refetch}
          onBack={() => router.back()}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      scrollable
    >
      <View className="p-4 pt-6 pb-8">
        {/* Header */}
        <View className="flex-row items-start justify-between mb-6">
          <View className="flex-1">
            <AppText variant="h1" className="mb-2">
              {customerDetails?.name}
            </AppText>
            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center gap-1.5">
                <Phone size={14} color={colors.mutedForeground} />
                <AppText variant="bodySmall" muted>
                  {customerDetails?.phone}
                </AppText>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Calendar size={14} color={colors.mutedForeground} />
                <AppText variant="bodySmall" muted>
                  {formatDate(customerDetails?.created_at || "")}
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
              onPress={() => router.push(`/more/customers/edit/${id}` as any)}
              className="w-10 h-10 rounded-[14px] bg-muted-light dark:bg-muted-dark border border-border-light dark:border-border-dark items-center justify-center"
            >
              <Edit2 size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Info Card */}
        <Card className="mb-6">
          <View className="p-4">
            <AppText variant="h3" className="mb-4">
              معلومات العميل
            </AppText>

            <View className="bg-muted-light dark:bg-muted-dark rounded-xl p-4 border border-border-light dark:border-border-dark">
              <View className="flex-row items-center justify-between mb-4">
                <AppText variant="caption" muted>
                  رقم الهاتف
                </AppText>
                <View className="flex-row items-center gap-1.5">
                  <Phone size={14} color={colors.mutedForeground} />
                  <AppText className="font-bold text-sm">
                    {customerDetails?.phone}
                  </AppText>
                </View>
              </View>

              <View className="h-[1px] bg-border-light dark:bg-border-dark mb-4" />

              <View className="flex-row items-center justify-between">
                <AppText variant="caption" muted>
                  العنوان
                </AppText>
                <View className="flex-row items-center gap-1.5 flex-1 justify-end">
                  <MapPin size={14} color={colors.mutedForeground} />
                  <AppText className="font-bold text-sm text-right">
                    {customerDetails?.address || "---"}
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        </Card>
      </View>

      <AppDeleteModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="حذف العميل؟"
        description={`هل أنت متأكد من رغبتك في حذف "${customerDetails?.name}"؟`}
      />
    </AppScreen>
  );
};

export default CustomerDetailPage;
