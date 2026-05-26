import AppButton from "@/src/components/custom/AppButton";
import AppDatePicker from "@/src/components/custom/AppDatePicker";
import AppInput from "@/src/components/custom/AppInput";
import AppScreen from "@/src/components/custom/AppScreen";
import AppSelect from "@/src/components/custom/AppSelect";
import AppText from "@/src/components/custom/AppText";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useGetAllBarns } from "@/src/hooks/Actions/barn/useCurdsBarn";
import { useAddBatch } from "@/src/hooks/Actions/batch/useCurdBatch";
import { useGetMe } from "@/src/hooks/Actions/users/useCurdsUser";
import { setUser } from "@/src/services/cookies";
import { batchSchema } from "@/src/validationSchema/batch/batch";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Calendar, FileText, Hash, Tags, Warehouse } from "lucide-react-native";
import { Controller, useForm, useWatch } from "react-hook-form";
import { View } from "react-native";
import type { z } from "zod";

type BatchFormData = z.infer<typeof batchSchema>;

const Batch = () => {
  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    mode: "onChange",
    defaultValues: {
      barn_id: "",
      poultry_type: "",
      initial_quantity: "",
      start_date: "",
      end_date: "",
      notes: "",
    },
  });

  const { data: barns, isPending: barnsIsPending } = useGetAllBarns();
  const {
    data: userData,
    isPending: userIsPending,
    refetch: refetchUser,
  } = useGetMe();

  const startDate = useWatch({ control, name: "start_date" });
  const minEndDate = startDate ? new Date(startDate) : undefined;

  const barnsData = barns as
    | { data: { data: { id: number; name: string }[] } }
    | undefined;

  const barnOptions = (barnsData?.data?.data ?? []).map((barn) => ({
    label: barn.name,
    value: barn.id,
  }));

  const { mutate, isPending } = useAddBatch();

  const onSubmit = (data: BatchFormData) => {
    mutate(
      {
        data: {
          ...data,
          barn_id: Number(data.barn_id),
          initial_quantity: Number(data.initial_quantity),
        },
      },
      {
        onSuccess: async () => {
          try {
            const { data: refreshedUserData } = await refetchUser();
            const user = refreshedUserData?.data?.data;
            await setUser(user);
            console.log("userdata", user);
            router.replace("/");
          } catch {
            console.log("Error updating user data after adding batch");
          }
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
        <View className="items-center mb-8">
          <View className="w-12 h-12 bg-secondary-light dark:bg-secondary-dark border border-border-light dark:border-border-dark rounded-xl items-center justify-center mb-4">
            <Tags size={24} color={colors.text} />
          </View>
          <AppText variant="h1" className="text-center">
            بيانات الدفعة
          </AppText>
          <AppText variant="body" muted className="text-center mt-1">
            أدخل بيانات الدفعة الجديدة
          </AppText>
        </View>

        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            العنبر
          </AppText>
          <Controller
            control={control}
            name="barn_id"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppSelect
                leftIcon={
                  <Warehouse size={18} color={colors.mutedForeground} />
                }
                placeholder="اختر العنبر"
                options={barnOptions}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.barn_id?.message}
                loading={barnsIsPending}
              />
            )}
          />
        </View>

        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            نوع الدواجن
          </AppText>
          <Controller
            control={control}
            name="poultry_type"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                rightIcon={<Tags size={18} color={colors.mutedForeground} />}
                placeholder="أدخل نوع الدواجن"
                error={errors.poultry_type?.message}
                textAlign="right"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            الكمية الابتدائية
          </AppText>
          <Controller
            control={control}
            name="initial_quantity"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                keyboardType="numeric"
                rightIcon={<Hash size={18} color={colors.mutedForeground} />}
                placeholder="أدخل الكمية الابتدائية"
                error={errors.initial_quantity?.message}
                textAlign="right"
                value={value?.toString() ?? ""}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        <View className="mb-5">
          <Controller
            control={control}
            name="start_date"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppDatePicker
                leftIcon={<Calendar size={18} color={colors.mutedForeground} />}
                placeholder="اختر تاريخ البداية"
                label="تاريخ البداية"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.start_date?.message}
              />
            )}
          />
        </View>

        <View className="mb-5">
          <Controller
            control={control}
            name="end_date"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppDatePicker
                leftIcon={<Calendar size={18} color={colors.mutedForeground} />}
                placeholder="اختر تاريخ النهاية (اختياري)"
                label="تاريخ النهاية"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.end_date?.message}
                minimumDate={minEndDate}
              />
            )}
          />
        </View>

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
                placeholder="أدخل ملاحظات (اختياري)"
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

        <AppButton loading={isPending} onPress={handleSubmit(onSubmit)}>
          حفظ
        </AppButton>
      </View>
    </AppScreen>
  );
};

export default Batch;
