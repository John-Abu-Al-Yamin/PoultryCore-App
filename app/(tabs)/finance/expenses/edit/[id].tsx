import React, { useMemo, useEffect, useRef } from "react";
import { View, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wallet, Hash, ClipboardList, Calendar as CalendarIcon } from "lucide-react-native";

import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import AppInput from "@/src/components/custom/AppInput";
import AppSelect from "@/src/components/custom/AppSelect";
import AppDatePicker from "@/src/components/custom/AppDatePicker";
import AppButton from "@/src/components/custom/AppButton";
import { useTheme } from "@/src/contexts/ThemeContext";

import { expenseSchema } from "@/src/validationSchema/expense/expense";
import { useGetExpenseById, useUpdateExpense } from "@/src/hooks/Actions/expenses/useCurdExpenses";
import { useGetAllBatches } from "@/src/hooks/Actions/batch/useCurdBatch";
import { expenseTypeOptions } from "@/src/constants/expenseTypes";
import type { z } from "zod";

type ExpenseFormData = z.infer<typeof expenseSchema>;

export default function EditExpense() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  
  const { data: expenseData, isPending: loadingExpense } = useGetExpenseById(id!);
  const { mutate, isPending: updating } = useUpdateExpense(id);
  const { data: batchesData, isPending: loadingBatches } = useGetAllBatches(1, 100);

  const hasInitialized = useRef(false);

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
    reset,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      batch_id: "",
      type: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  useEffect(() => {
    if (expenseData?.data?.data && !hasInitialized.current) {
      const expense = expenseData.data.data;
      reset({
        batch_id: expense.batch_id,
        type: expense.type,
        amount: expense.amount.toString(),
        date: expense.date,
        notes: expense.notes || "",
      });
      hasInitialized.current = true;
    }
  }, [expenseData, reset]);

  const onSubmit = (data: ExpenseFormData) => {
    mutate(
      { id, data },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  };

  if (loadingExpense) {
    return (
      <AppScreen className="bg-background-light dark:bg-background-dark justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </AppScreen>
    );
  }

  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="px-4 pt-4 pb-8"
    >
      <View className="mb-6">
        <AppText variant="h1">تعديل مصروف</AppText>
        <AppText variant="body" muted className="mt-1">
          قم بتعديل بيانات المصروف أدناه
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

        {/* Expense Type */}
        <View>
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value, onBlur } }) => (
              <AppSelect
                label="نوع المصروف"
                placeholder="اختر نوع المصروف"
                options={expenseTypeOptions}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.type?.message}
                leftIcon={<ClipboardList size={18} color={colors.mutedForeground} />}
              />
            )}
          />
        </View>

        {/* Amount */}
        <View>
          <AppText variant="label" className="mb-2">
            المبلغ
          </AppText>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value, onBlur } }) => (
              <AppInput
                placeholder="0.00"
                keyboardType="numeric"
                value={value?.toString()}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.amount?.message}
                leftIcon={<Wallet size={18} color={colors.mutedForeground} />}
                textAlign="right"
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
                placeholder="أدخل أي ملاحظات إضافية"
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
          <AppButton loading={updating} onPress={handleSubmit(onSubmit)}>
            تحديث المصروف
          </AppButton>
        </View>
      </View>
    </AppScreen>
  );
}
