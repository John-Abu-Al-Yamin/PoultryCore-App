import AppButton from "@/src/components/custom/AppButton";
import AppDatePicker from "@/src/components/custom/AppDatePicker";
import AppInput from "@/src/components/custom/AppInput";
import AppScreen from "@/src/components/custom/AppScreen";
import AppSelect from "@/src/components/custom/AppSelect";
import AppText from "@/src/components/custom/AppText";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useGetAllCustomers } from "@/src/hooks/Actions/customers/useCurdCustomers";
import { useGetAllBatches } from "@/src/hooks/Actions/batch/useCurdBatch";
import { useAddSale } from "@/src/hooks/Actions/sales/useCurdSales";
import { saleSchema } from "@/src/validationSchema/sale/sale";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import {
  Bird,
  Calendar,
  DollarSign,
  Hash,
  Layers,
  Users,
} from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import type { z } from "zod";
import { toast } from "@/src/services/toast";
import {
  poultryTypeOptions,
  paymentTypeOptions,
} from "@/src/constants/poultryTypes";

type SaleFormData = z.infer<typeof saleSchema>;

export default function AddSalePage() {
  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    mode: "onChange",
    defaultValues: {
      customer_id: "",
      batch_id: "",
      item_name: "",
      quantity: "",
      unit_price: "",
      sale_date: "",
      payment_type: "",
    },
  });

  const { data: customers, isPending: customersIsPending } =
    useGetAllCustomers();
  const { data: batches, isPending: batchesIsPending } = useGetAllBatches();
  const { mutate, isPending } = useAddSale();

  const customerOptions = (customers?.data?.data ?? []).map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const batchOptions = (batches?.data?.data ?? []).map((b) => ({
    label: `${b.poultry_type} - #${b.id}`,
    value: b.id,
  }));

  const onSubmit = (data: SaleFormData) => {
    mutate({
      data: {
        customer_id: Number(data.customer_id),
        batch_id: Number(data.batch_id),
        item_name: data.item_name,
        quantity: Number(data.quantity),
        unit_price: Number(data.unit_price),
        sale_date: data.sale_date,
        payment_type: data.payment_type,
      },
      onSuccess: () => {
        toast.success("اتضافت المبيعات بنجاح");
        router.back();
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message || "حصل خطأ في إضافة المبيعات";
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
        <AppText variant="h1">إضافة مبيعات جديدة</AppText>
        <AppText variant="body" muted className="mt-1">
          اكتب بيانات المبيعات الجديدة لإضافتها إلى النظام
        </AppText>
      </View>

      <View className="p-2">
        {/* Customer */}
        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            العميل
          </AppText>
          <Controller
            control={control}
            name="customer_id"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppSelect
                leftIcon={
                  <Users size={18} color={colors.mutedForeground} />
                }
                placeholder="اختار العميل"
                options={customerOptions}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.customer_id?.message}
                loading={customersIsPending}
              />
            )}
          />
        </View>

        {/* Batch */}
        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            الدفعة
          </AppText>
          <Controller
            control={control}
            name="batch_id"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppSelect
                leftIcon={<Layers size={18} color={colors.mutedForeground} />}
                placeholder="اختار الدفعة"
                options={batchOptions}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.batch_id?.message}
                loading={batchesIsPending}
              />
            )}
          />
        </View>

        {/* Item name */}
        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            اسم الصنف
          </AppText>
          <Controller
            control={control}
            name="item_name"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppSelect
                leftIcon={<Bird size={18} color={colors.mutedForeground} />}
                placeholder="اختار الصنف"
                options={poultryTypeOptions}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.item_name?.message}
              />
            )}
          />
        </View>

        {/* Quantity */}
        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            الكمية
          </AppText>
          <Controller
            control={control}
            name="quantity"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                keyboardType="numeric"
                rightIcon={<Hash size={18} color={colors.mutedForeground} />}
                placeholder="0"
                error={errors.quantity?.message}
                textAlign="right"
                value={String(value ?? "")}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        {/* Unit price */}
        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            سعر الوحدة
          </AppText>
          <Controller
            control={control}
            name="unit_price"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                keyboardType="decimal-pad"
                rightIcon={
                  <DollarSign size={18} color={colors.mutedForeground} />
                }
                placeholder="0.00"
                error={errors.unit_price?.message}
                textAlign="right"
                value={String(value ?? "")}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        {/* Payment type */}
        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            نوع الدفع
          </AppText>
          <Controller
            control={control}
            name="payment_type"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppSelect
                leftIcon={
                  <DollarSign size={18} color={colors.mutedForeground} />
                }
                placeholder="اختار نوع الدفع"
                options={paymentTypeOptions}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.payment_type?.message}
              />
            )}
          />
        </View>

        {/* Sale date */}
        <View className="mb-8">
          <Controller
            control={control}
            name="sale_date"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppDatePicker
                leftIcon={<Calendar size={18} color={colors.mutedForeground} />}
                placeholder="اختار تاريخ البيع"
                label="تاريخ البيع"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.sale_date?.message}
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
              إضافة المبيعات
            </AppButton>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}
