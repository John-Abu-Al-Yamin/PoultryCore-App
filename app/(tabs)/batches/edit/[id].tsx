import { View, TouchableOpacity } from "react-native";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import AppInput from "@/src/components/custom/AppInput";
import AppButton from "@/src/components/custom/AppButton";
import AppLoading from "@/src/components/custom/AppLoading";
import AppError from "@/src/components/custom/AppError";
import AppDatePicker from "@/src/components/custom/AppDatePicker";
import AppSelect from "@/src/components/custom/AppSelect";
import { useTheme } from "@/src/contexts/ThemeContext";
import {
  Calendar,
  FileText,
  Tags,
  Warehouse,
  ChevronRight,
} from "lucide-react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { z } from "zod";
import { batchSchema } from "@/src/validationSchema/batch/batch";
import {
  useGetBatchById,
  useUpdateBatch,
} from "@/src/hooks/Actions/batch/useCurdBatch";
import { useGetAllBarns } from "@/src/hooks/Actions/barn/useCurdsBarn";
import { router, useLocalSearchParams } from "expo-router";
import { toast } from "@/src/services/toast";
import { useEffect } from "react";
import endPoints from "@/src/hooks/EndPoints/endPoints";

type BatchFormData = z.infer<typeof batchSchema>;

export default function EditBatchPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  const {
    data: batchResponse,
    isPending: isFetching,
    isError: isFetchError,
    refetch,
  } = useGetBatchById(id || "");

  const batchData = batchResponse?.data?.data;

  const {
    control,
    handleSubmit,
    reset,
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

  useEffect(() => {
    if (batchData) {
      reset({
        barn_id: batchData.barn_id,
        poultry_type: batchData.poultry_type,

        start_date: batchData.start_date,
        end_date: batchData.end_date || "",
        notes: batchData.notes || "",
      });
    }
  }, [batchData, reset]);
  const { mutate, isPending: isUpdating } = useUpdateBatch();

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

  const onSubmit = (formData: BatchFormData) => {
    mutate(
      {
        id: id as string,
        data: {
          ...formData,
          barn_id: Number(formData.barn_id),

        },
        url: `${endPoints.batches}/${id}`,
      },
      {
        onSuccess: () => {
          toast.success("اتحدثت بيانات الدفعة بنجاح");
          router.back();
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message || "حصل خطأ في تحديث بيانات الدفعة";
          toast.error(errorMessage);
        },
      },
    );
  };

  if (isFetching) {
    return (
      <AppScreen scrollable={false}>
        <AppLoading fullScreen message="بيت حمّل بيانات الدفعة..." />
      </AppScreen>
    );
  }

  if (isFetchError) {
    return (
      <AppScreen scrollable={false}>
        <AppError
          fullScreen
          title="حصل خطأ في تحميل البيانات"
          message="مقدرناش نوصل لـ بيانات الدفعة المطلوبة."
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
      <View className="flex-row items-center gap-3 mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-muted-light dark:bg-muted-dark items-center justify-center border border-border-light dark:border-border-dark"
        >
          <ChevronRight size={20} color={colors.text} />
        </TouchableOpacity>
        <View>
          <AppText variant="h1">تعديل الدفعة</AppText>
          <AppText variant="bodySmall" muted>
            تحديث معلومات الدفعة رقم {batchData?.id}
          </AppText>
        </View>
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
                placeholder="ملاحظات إضافية..."
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
