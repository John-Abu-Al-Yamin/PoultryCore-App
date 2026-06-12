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
  useGetSupplierById,
  useDeleteSupplier,
} from "@/src/hooks/Actions/suppliers/useCurdSuppliers";
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

const SupplierDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: supplier, isPending, isError, refetch } = useGetSupplierById(id || "");
  const { mutate: deleteSupplier, isPending: isDeleting } = useDeleteSupplier();
  const { colors } = useTheme();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const supplierDetails = supplier?.data?.data;

  const handleDelete = () => {
    deleteSupplier(
      { id: id as string, url: `${endPoints.suppliers}/${id}` },
      {
        onSuccess: () => {
          setShowDeleteModal(false);
          toast.success("اتمسح المورد بنجاح");
          router.replace("/more/suppliers");
        },
        onError: (error: any) => {
          setShowDeleteModal(false);
          const errorMessage = error?.response?.data?.message || "حصل خطأ في مسح المورد";
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
        <AppLoading fullScreen message="بيت حمّل المورد..." />
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
          message="مقدرناش نحمل بيانات المورد."
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
              {supplierDetails?.name}
            </AppText>
            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center gap-1.5">
                <Phone size={14} color={colors.mutedForeground} />
                <AppText variant="bodySmall" muted>
                  {supplierDetails?.phone}
                </AppText>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Calendar size={14} color={colors.mutedForeground} />
                <AppText variant="bodySmall" muted>
                  {formatDate(supplierDetails?.created_at || "")}
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
              onPress={() => router.push(`/more/suppliers/edit/${id}` as any)}
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
              معلومات المورد
            </AppText>

            <View className="bg-muted-light dark:bg-muted-dark rounded-xl p-4 border border-border-light dark:border-border-dark">
              <View className="flex-row items-center justify-between mb-4">
                <AppText variant="caption" muted>
                  رقم التليفون
                </AppText>
                <View className="flex-row items-center gap-1.5">
                  <Phone size={14} color={colors.mutedForeground} />
                  <AppText className="font-bold text-sm">
                    {supplierDetails?.phone}
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
                    {supplierDetails?.address || "---"}
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
        title="مسح المورد؟"
        description={`هل أنت متأكد إنك عايز مسح "${supplierDetails?.name}"؟`}
      />
    </AppScreen>
  );
};

export default SupplierDetailPage;
