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

type BarnFormData = z.infer<typeof barnSchema>;

const Barn = () => {
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

  const { mutate, data, error, isPending, isSuccess, isError } = useAddBarn();

  const onSubmit = (data: BarnFormData) => {
    mutate(
      { data: data },
      {
        onSuccess: () => {
          // console.log("barn successful:", data);
          router.replace("/(setup)/batch");
        },
        onError: (error) => {
          console.log("Login failed:", error);
        },
      },
    );
  };

  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="items-center px-4 pt-20 justify-start"
    >
      <View className="w-full max-w-md bg-card-light dark:bg-background-dark rounded-2xl p-6">
        {/* ===== Header ===== */}
        <View className="items-center mb-8">
          <View className="w-12 h-12 bg-secondary-light dark:bg-secondary-dark border border-border-light dark:border-border-dark rounded-xl items-center justify-center mb-4">
            <Warehouse size={24} color={colors.text} />
          </View>
          <AppText variant="h1" className="text-center">
            بيانات العنبر
          </AppText>
          <AppText variant="body" muted className="text-center mt-1">
            اكتب بيانات العنبر الجديدة
          </AppText>
        </View>

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
                placeholder="اكتب اسم العنبر"
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
                placeholder="اكتب الموقع (اختياري)"
                error={errors.location?.message}
                textAlign="right"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        {/* ===== Capacity ===== */}
        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            السعة
          </AppText>
          <Controller
            control={control}
            name="capacity"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                keyboardType="numeric"
                rightIcon={<Hash size={18} color={colors.mutedForeground} />}
                placeholder="اكتب السعة "
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
        <View className="mb-4">
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
                placeholder="اكتب ملاحظات (اختياري)"
                error={errors.notes?.message}
                textAlign="right"
                multiline
                numberOfLines={3}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        {/* ===== Submit ===== */}
        <AppButton loading={isPending} onPress={handleSubmit(onSubmit)}>
          حفظ
        </AppButton>
      </View>
    </AppScreen>
  );
};

export default Barn;
