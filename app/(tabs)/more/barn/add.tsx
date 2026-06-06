import AppButton from "@/src/components/custom/AppButton";
import AppInput from "@/src/components/custom/AppInput";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { useTheme } from "@/src/contexts/ThemeContext";
import { FileText, Hash, MapPin, Warehouse } from "lucide-react-native";
import { View } from "react-native";

import { barnSchema } from "@/src/validationSchema/barn/barn";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { useAddBarn } from "@/src/hooks/Actions/barn/useCurdsBarn";
import { router } from "expo-router";
import { toast } from "@/src/services/toast";

type BarnFormData = z.infer<typeof barnSchema>;

export default function AddBarnPage() {
  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
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

  const { mutate, isPending } = useAddBarn();

  const onSubmit = (formData: BarnFormData) => {
    mutate(
      { data: formData },
      {
        onSuccess: () => {
          toast.success("تم إضافة العنبر بنجاح");
          router.back();
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || "فشل في إضافة العنبر";
          toast.error(errorMessage);
          console.log(error);
        },
      },
    );
  };

  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="px-4 pt-4 pb-8"
    >
      <View className="mb-6">
        <AppText variant="h1">إضافة عنبر جديد</AppText>
        <AppText variant="body" muted className="mt-1">
          أدخل بيانات العنبر الجديدة لإضافته إلى النظام
        </AppText>
      </View>

      <View className="p-2  ">
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
                placeholder="مثال: عنبر المصفه"
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
                placeholder="مثال: عنبر شرق البلد"
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
                placeholder="أدخل عدد الطيور التي يستوعبها العنبر"
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
            ملاحظات إضافية
          </AppText>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                rightIcon={
                  <FileText size={18} color={colors.mutedForeground} />
                }
                placeholder="أي معلومات إضافية عن العنبر..."
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
              disabled={isPending}
            >
              إلغاء
            </AppButton>
          </View>
          <View className="flex-[2]">
            <AppButton loading={isPending} onPress={handleSubmit(onSubmit)}>
              إضافة العنبر
            </AppButton>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}
