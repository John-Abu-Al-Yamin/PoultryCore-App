import { View, TouchableOpacity } from "react-native";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import AppInput from "@/src/components/custom/AppInput";
import AppButton from "@/src/components/custom/AppButton";
import AppLoading from "@/src/components/custom/AppLoading";
import AppError from "@/src/components/custom/AppError";
import { useTheme } from "@/src/contexts/ThemeContext";
import { MapPin, Phone, User, ChevronRight } from "lucide-react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { customerSchema } from "@/src/validationSchema/customer/customer";
import {
  useGetCustomerById,
  useUpdateCustomer,
} from "@/src/hooks/Actions/customers/useCurdCustomers";
import { router, useLocalSearchParams } from "expo-router";
import { toast } from "@/src/services/toast";
import { useEffect } from "react";
import endPoints from "@/src/hooks/EndPoints/endPoints";

type CustomerFormData = z.infer<typeof customerSchema>;

export default function EditCustomerPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  const {
    data: customerResponse,
    isPending: isFetching,
    isError: isFetchError,
    refetch,
  } = useGetCustomerById(id || "");

  const customerData = customerResponse?.data?.data;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (customerData) {
      reset({
        name: customerData.name,
        phone: customerData.phone,
        address: customerData.address || "",
      });
    }
  }, [customerData, reset]);

  const { mutate, isPending: isUpdating } = useUpdateCustomer();

  const onSubmit = (formData: CustomerFormData) => {
    mutate(
      {
        id: id as string,
        data: formData,
        url: `${endPoints.customers}/${id}`,
      },
      {
        onSuccess: () => {
          toast.success("تم تحديث بيانات العميل بنجاح");
          router.back();
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || "فشل في تحديث بيانات العميل";
          toast.error(errorMessage);
        },
      },
    );
  };

  if (isFetching) {
    return (
      <AppScreen scrollable={false}>
        <AppLoading fullScreen message="جاري تحميل بيانات العميل..." />
      </AppScreen>
    );
  }

  if (isFetchError) {
    return (
      <AppScreen scrollable={false}>
        <AppError
          fullScreen
          title="فشل تحميل البيانات"
          message="تعذر الوصول إلى بيانات العميل المطلوبة."
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
      {/* Header */}
      <View className="flex-row items-center gap-3 mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-muted-light dark:bg-muted-dark items-center justify-center border border-border-light dark:border-border-dark"
        >
          <ChevronRight size={20} color={colors.text} />
        </TouchableOpacity>
        <View>
          <AppText variant="h1">تعديل العميل</AppText>
          <AppText variant="bodySmall" muted>
            تحديث معلومات: {customerData?.name}
          </AppText>
        </View>
      </View>

      <View className="p-2">
        {/* Name */}
        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            اسم العميل
          </AppText>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                rightIcon={<User size={18} color={colors.mutedForeground} />}
                placeholder="أدخل اسم العميل"
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
                placeholder="أدخل العنوان"
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
