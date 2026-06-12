import AppButton from "@/src/components/custom/AppButton";
import AppDatePicker from "@/src/components/custom/AppDatePicker";
import AppInput from "@/src/components/custom/AppInput";
import AppScreen from "@/src/components/custom/AppScreen";
import AppSelect from "@/src/components/custom/AppSelect";
import AppText from "@/src/components/custom/AppText";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useGetAllBarns } from "@/src/hooks/Actions/barn/useCurdsBarn";
import { useAddBatch } from "@/src/hooks/Actions/batch/useCurdBatch";
import { batchSchema } from "@/src/validationSchema/batch/batch";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Calendar, FileText, Tags, Warehouse } from "lucide-react-native";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { View } from "react-native";
import type { z } from "zod";
import { toast } from "@/src/services/toast";

type BatchFormData = z.infer<typeof batchSchema>;

export default function AddBatchPage() {
  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    mode: "onChange",
    defaultValues: {
      barn_id: "",
      poultry_type: "",

      start_date: "",
      end_date: "",
      notes: "",
    },
  });

  const { data: barns, isPending: barnsIsPending } = useGetAllBarns();
  const { mutate, isPending } = useAddBatch();

  const startDate = useWatch({ control, name: "start_date" });
  const endDate = useWatch({ control, name: "end_date" });

  const parsedStart = startDate ? new Date(startDate) : undefined;
  const parsedEnd = endDate ? new Date(endDate) : undefined;

  const minEndDate = parsedStart;
  const maxStartDate = parsedEnd;

  useEffect(() => {
    if (!startDate || !endDate) return;
    if (new Date(endDate) < new Date(startDate)) {
      setValue("end_date", "", { shouldValidate: true });
    }
  }, [startDate, setValue, endDate]);

  const barnOptions = (barns?.data?.data ?? []).map((barn) => ({
    label: barn.name,
    value: barn.id,
  }));

  const onSubmit = (data: BatchFormData) => {
    mutate({
      data: {
        ...data,
        barn_id: Number(data.barn_id),

      },
      onSuccess: () => {
        toast.success("اتضافت الدفعة بنجاح");
        router.back();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "حصل خطأ في إضافة الدفعة";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="px-4 pt-4 pb-8"
    >
      <View className="mb-6">
        <AppText variant="h1">إضافة دفعة جديدة</AppText>
        <AppText variant="body" muted className="mt-1">
           اكتب بيانات الدفعة الجديدة عشان تضاف للنظام
        </AppText>
      </View>

      <View className="p-2">
        {/* Barn */}
        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            العنبر
          </AppText>
          <Controller
            control={control}
            name="barn_id"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppSelect
                leftIcon={<Warehouse size={18} color={colors.mutedForeground} />}
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

        {/* Poultry type */}
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
                placeholder="اكتب نوع الدواجن"
                error={errors.poultry_type?.message}
                textAlign="right"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        {/* Start date */}
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
                maximumDate={maxStartDate}
              />
            )}
          />
        </View>

        {/* End date */}
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

        {/* Notes */}
        <View className="mb-8">
          <AppText variant="label" className="mb-2">
            ملاحظات
          </AppText>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                rightIcon={<FileText size={18} color={colors.mutedForeground} />}
                placeholder="اكتب ملاحظات (اختياري)"
                error={errors.notes?.message}
                textAlign="right"
                multiline
                numberOfLines={3}
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
              إضافة الدفعة
            </AppButton>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}
