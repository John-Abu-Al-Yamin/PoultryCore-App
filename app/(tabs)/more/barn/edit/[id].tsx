import { View, TouchableOpacity } from "react-native";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import AppInput from "@/src/components/custom/AppInput";
import AppButton from "@/src/components/custom/AppButton";
import AppLoading from "@/src/components/custom/AppLoading";
import AppError from "@/src/components/custom/AppError";
import { useTheme } from "@/src/contexts/ThemeContext";
import {
  FileText,
  Hash,
  MapPin,
  Warehouse,
  ChevronRight,
} from "lucide-react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { barnSchema } from "@/src/validationSchema/barn/barn";
import {
  useGetBarnById,
  useUpdateBarn,
} from "@/src/hooks/Actions/barn/useCurdsBarn";
import { router, useLocalSearchParams } from "expo-router";
import { toast } from "@/src/services/toast";
import { useEffect } from "react";

type BarnFormData = z.infer<typeof barnSchema>;

export default function EditBarnPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  const {
    data: barnResponse,
    isPending: isFetching,
    isError: isFetchError,
    refetch,
  } = useGetBarnById(id || "");

  const barnData = barnResponse?.data?.data;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BarnFormData>({
    resolver: zodResolver(barnSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      location: "",
      capacity: "",
      notes: "",
    },
  });

  // Pre-populate form when data is fetched
  useEffect(() => {
    if (barnData) {
      reset({
        name: barnData.name,
        location: barnData.location || "",
        capacity: barnData.capacity.toString(),
        notes: barnData.notes || "",
      });
    }
  }, [barnData, reset]);

  const { mutate, isPending: isUpdating } = useUpdateBarn(id);

  const onSubmit = (formData: BarnFormData) => {
    mutate(
      {
        id: id as string,
        data: formData,
      },
      {
        onSuccess: () => {
          toast.success("تم تحديث بيانات العنبر بنجاح");
          router.back();
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message || "فشل في تحديث بيانات العنبر";
          toast.error(errorMessage);
          console.log(error);
        },
      },
    );
  };

  if (isFetching) {
    return (
      <AppScreen scrollable={false}>
        <AppLoading fullScreen message="جاري تحميل بيانات العنبر..." />
      </AppScreen>
    );
  }

  if (isFetchError) {
    return (
      <AppScreen scrollable={false}>
        <AppError
          fullScreen
          title="فشل تحميل البيانات"
          message="تعذر الوصول إلى بيانات العنبر المطلوبة."
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
      {/* ===== Header ===== */}
      <View className="flex-row items-center gap-3 mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-muted-light dark:bg-muted-dark items-center justify-center border border-border-light dark:border-border-dark"
        >
          <ChevronRight size={20} color={colors.text} />
        </TouchableOpacity>
        <View>
          <AppText variant="h1">تعديل العنبر</AppText>
          <AppText variant="bodySmall" muted>
            تحديث معلومات: {barnData?.name}
          </AppText>
        </View>
      </View>

      <View className="p-2">
        {/* ===== Name ===== */}
        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            اسم العنبر
          </AppText>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                rightIcon={
                  <Warehouse size={18} color={colors.mutedForeground} />
                }
                placeholder="أدخل اسم العنبر"
                error={errors.name?.message}
                textAlign="right"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        {/* ===== Location ===== */}
        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            الموقع
          </AppText>
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                rightIcon={<MapPin size={18} color={colors.mutedForeground} />}
                placeholder="أدخل الموقع"
                error={errors.location?.message}
                textAlign="right"
                value={value || ""}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        {/* ===== Capacity ===== */}
        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            السعة الإجمالية (طائر)
          </AppText>
          <Controller
            control={control}
            name="capacity"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                keyboardType="numeric"
                rightIcon={<Hash size={18} color={colors.mutedForeground} />}
                placeholder="أدخل السعة"
                error={errors.capacity?.message}
                textAlign="right"
                value={value?.toString() ?? ""}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        {/* ===== Notes ===== */}
        <View className="mb-8">
          <AppText variant="label" className="mb-2">
            ملاحظات
          </AppText>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                rightIcon={
                  <FileText size={18} color={colors.mutedForeground} />
                }
                placeholder="ملاحظات إضافية..."
                error={errors.notes?.message}
                textAlign="right"
                multiline
                numberOfLines={3}
                value={value || ""}
                onBlur={onBlur}
                onChangeText={onChange}
                containerClassName="h-24"
              />
            )}
          />
        </View>

        {/* ===== Actions ===== */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <AppButton
              variant="outline"
              onPress={() => router.back()}
              disabled={isUpdating}
            >
              إلغاء
            </AppButton>
          </View>
          <View className="flex-[2]">
            <AppButton loading={isUpdating} onPress={handleSubmit(onSubmit)}>
              حفظ التعديلات
            </AppButton>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}
