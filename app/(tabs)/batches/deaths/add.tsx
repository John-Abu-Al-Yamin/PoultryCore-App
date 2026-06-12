import React, { useMemo } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bird,
  ClipboardList,
  Hash,
  Calendar as CalendarIcon,
} from "lucide-react-native";

import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import AppInput from "@/src/components/custom/AppInput";
import AppSelect from "@/src/components/custom/AppSelect";
import AppDatePicker from "@/src/components/custom/AppDatePicker";
import AppButton from "@/src/components/custom/AppButton";
import { useTheme } from "@/src/contexts/ThemeContext";

import { deathSchema } from "@/src/validationSchema/death/death";
import { useAddDeath } from "@/src/hooks/Actions/deaths/useCurdDeaths";
import { useGetAllBatches } from "@/src/hooks/Actions/batch/useCurdBatch";
import type { z } from "zod";

type DeathFormData = z.infer<typeof deathSchema>;

export default function AddDeath() {
  const { colors } = useTheme();
  const { mutate, isPending } = useAddDeath();
  const { data: batchesData, isPending: loadingBatches } = useGetAllBatches(1, 100);

  const batchOptions = useMemo(() => {
    return (
      batchesData?.data?.data?.map((batch) => ({
        label: `دفعة ${batch.id} - ${batch.poultry_type}`,
        value: batch.id,
      })) || []
    );
  }, [batchesData]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DeathFormData>({
    resolver: zodResolver(deathSchema),
    defaultValues: {
      batch_id: "",
      quantity: "",
      reason: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const onSubmit = (data: DeathFormData) => {
    mutate(
      { data },
      {
        onSuccess: () => {
          router.back();
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
        <AppText variant="h1">تسجيل نفوق جديد</AppText>
        <AppText variant="body" muted className="mt-1">
           اكتب بيانات حالة النفوق الجديدة
        </AppText>
      </View>

      <View className="gap-y-4">
        {/* Batch Selection */}
        <View>
          <Controller
            control={control}
            name="batch_id"
            render={({ field: { onChange, value, onBlur } }) => (
              <AppSelect
                label="الدفعة"
                placeholder="اختر الدفعة"
                options={batchOptions}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.batch_id?.message}
                loading={loadingBatches}
                leftIcon={<Hash size={18} color={colors.mutedForeground} />}
              />
            )}
          />
        </View>

        {/* Quantity */}
        <View>
          <AppText variant="label" className="mb-2">
            عدد الطيور النافقة
          </AppText>
          <Controller
            control={control}
            name="quantity"
            render={({ field: { onChange, value, onBlur } }) => (
              <AppInput
                placeholder="0"
                keyboardType="numeric"
                value={value?.toString()}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.quantity?.message}
                leftIcon={<Bird size={18} color={colors.mutedForeground} />}
                textAlign="right"
              />
            )}
          />
        </View>

        {/* Reason */}
        <View>
          <Controller
            control={control}
            name="reason"
            render={({ field: { onChange, value, onBlur } }) => (
              <AppSelect
                label="سبب النفوق"
                placeholder="اختر السبب"
                options={[
                  { label: "مرض", value: "مرض" },
                  { label: "إصابة", value: "إصابة" },
                  { label: "ضعف", value: "ضعف" },
                  { label: "درجة حرارة", value: "درجة حرارة" },
                  { label: "اختناق", value: "اختناق" },
                  { label: "أخرى", value: "أخرى" },
                ]}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.reason?.message}
                leftIcon={<ClipboardList size={18} color={colors.mutedForeground} />}
              />
            )}
          />
        </View>

        {/* Date */}
        <View>
          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value, onBlur } }) => (
              <AppDatePicker
                label="التاريخ"
                placeholder="اختر التاريخ"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.date?.message}
                leftIcon={<CalendarIcon size={18} color={colors.mutedForeground} />}
              />
            )}
          />
        </View>

        {/* Notes */}
        <View>
          <AppText variant="label" className="mb-2">
            ملاحظات (اختياري)
          </AppText>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value, onBlur } }) => (
              <AppInput
                placeholder="اكتب أي ملاحظات إضافية"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.notes?.message}
                multiline
                numberOfLines={3}
                textAlign="right"
                style={{ height: 100, textAlignVertical: "top" }}
              />
            )}
          />
        </View>

        <View className="mt-4">
          <AppButton loading={isPending} onPress={handleSubmit(onSubmit)}>
            تسجيل النفوق
          </AppButton>
        </View>
      </View>
    </AppScreen>
  );
}
