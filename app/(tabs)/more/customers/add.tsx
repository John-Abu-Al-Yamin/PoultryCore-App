import AppButton from "@/src/components/custom/AppButton";
import AppInput from "@/src/components/custom/AppInput";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { useTheme } from "@/src/contexts/ThemeContext";
import { ContactRound, MapPin, Phone, User } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

import { customerSchema } from "@/src/validationSchema/customer/customer";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import { useAddCustomer } from "@/src/hooks/Actions/customers/useCurdCustomers";
import { useContactPicker } from "@/src/hooks/useContactPicker";
import { router } from "expo-router";
import { toast } from "@/src/services/toast";

type CustomerFormData = z.infer<typeof customerSchema>;

export default function AddCustomerPage() {
  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
    setValue,
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

  const { mutate, isPending } = useAddCustomer();
  const { pickContact } = useContactPicker();

  const onSubmit = (formData: CustomerFormData) => {
    mutate(
      { data: formData },
      {
        onSuccess: () => {
          toast.success("اتضافت العميل بنجاح");
          router.back();
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || "حصل خطأ في إضافة العميل";
          // toast.error(errorMessage);
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
        <AppText variant="h1">إضافة عميل جديد</AppText>
        <AppText variant="body" muted className="mt-1">
          اكتب بيانات العميل الجديد لإضافته إلى النظام
        </AppText>
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
                placeholder="مثال: أحمد محمد"
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
            رقم التليفون
          </AppText>
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    keyboardType="phone-pad"
                    rightIcon={<Phone size={18} color={colors.mutedForeground} />}
                    placeholder="اكتب رقم التليفون"
                    error={errors.phone?.message}
                    textAlign="right"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
            <TouchableOpacity
              onPress={async () => {
                const phone = await pickContact();
                if (phone) setValue("phone", phone);
              }}
              className="w-11 h-11 rounded-xl bg-muted-light dark:bg-muted-dark border border-border-light dark:border-border-dark items-center justify-center self-end mb-0.5"
            >
              <ContactRound size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
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
                placeholder="اكتب العنوان (اختياري)"
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
              إضافة العميل
            </AppButton>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}
