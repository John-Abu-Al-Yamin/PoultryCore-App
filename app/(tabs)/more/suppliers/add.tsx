import AppButton from "@/src/components/custom/AppButton";
import AppInput from "@/src/components/custom/AppInput";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { useTheme } from "@/src/contexts/ThemeContext";
import { MapPin, Phone, User } from "lucide-react-native";
import { View } from "react-native";

import { supplierSchema } from "@/src/validationSchema/supplier/supplier";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { useAddSupplier } from "@/src/hooks/Actions/suppliers/useCurdSuppliers";
import { router } from "expo-router";
import { toast } from "@/src/services/toast";

type SupplierFormData = z.infer<typeof supplierSchema>;

export default function AddSupplierPage() {
  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  const { mutate, isPending } = useAddSupplier();

  const onSubmit = (formData: SupplierFormData) => {
    mutate(
      { data: formData },
      {
        onSuccess: () => {
          toast.success("تم إضافة المورد بنجاح");
          router.back();
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || "فشل في إضافة المورد";
          toast.error(errorMessage);
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
        <AppText variant="h1">إضافة مورد جديد</AppText>
        <AppText variant="body" muted className="mt-1">
          أدخل بيانات المورد الجديد لإضافته إلى النظام
        </AppText>
      </View>

      <View className="p-2">
        {/* Name */}
        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            اسم المورد
          </AppText>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                rightIcon={<User size={18} color={colors.mutedForeground} />}
                placeholder="مثال: محمد علي"
                error={errors.name?.message}
                textAlign="right"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        {/* Phone */}
        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            رقم الهاتف
          </AppText>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                keyboardType="phone-pad"
                rightIcon={<Phone size={18} color={colors.mutedForeground} />}
                placeholder="أدخل رقم الهاتف"
                error={errors.phone?.message}
                textAlign="right"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        {/* Address */}
        <View className="mb-8">
          <AppText variant="label" className="mb-2">
            العنوان
          </AppText>
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                rightIcon={<MapPin size={18} color={colors.mutedForeground} />}
                placeholder="أدخل العنوان (اختياري)"
                error={errors.address?.message}
                textAlign="right"
                value={value || ""}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        {/* Actions */}
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
              إضافة المورد
            </AppButton>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}
