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
  Bird,
  Calendar,
  ChevronRight,
  DollarSign,
  Hash,
  Layers,
  Users,
} from "lucide-react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { saleSchema } from "@/src/validationSchema/sale/sale";
import {
  useGetSaleById,
  useUpdateSale,
} from "@/src/hooks/Actions/sales/useCurdSales";
import { useGetAllCustomers } from "@/src/hooks/Actions/customers/useCurdCustomers";
import { useGetAllBatches } from "@/src/hooks/Actions/batch/useCurdBatch";
import { router, useLocalSearchParams } from "expo-router";
import { toast } from "@/src/services/toast";
import { useEffect } from "react";
import endPoints from "@/src/hooks/EndPoints/endPoints";
import {
  poultryTypeOptions,
  paymentTypeOptions,
} from "@/src/constants/poultryTypes";

type SaleFormData = z.infer<typeof saleSchema>;

export default function EditSalePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  const {
    data: saleResponse,
    isPending: isFetching,
    isError: isFetchError,
    refetch,
  } = useGetSaleById(id || "");

  const saleData = saleResponse?.data?.data;

  const {
    control,
    handleSubmit,
    reset,
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

  useEffect(() => {
    if (saleData) {
      reset({
        customer_id: saleData.customer_id,
        batch_id: saleData.batch_id,
        item_name: saleData.item_name,
        quantity: String(saleData.quantity),
        unit_price: saleData.unit_price,
        sale_date: saleData.sale_date,
        payment_type: saleData.payment_type,
      });
    }
  }, [saleData, reset]);

  const { mutate, isPending: isUpdating } = useUpdateSale();

  const customerOptions = (customers?.data?.data ?? []).map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const batchOptions = (batches?.data?.data ?? []).map((b) => ({
    label: `${b.poultry_type} - #${b.id}`,
    value: b.id,
  }));

  const onSubmit = (formData: SaleFormData) => {
    mutate(
      {
        id: id as string,
        data: {
          customer_id: Number(formData.customer_id),
          batch_id: Number(formData.batch_id),
          item_name: formData.item_name,
          quantity: Number(formData.quantity),
          unit_price: Number(formData.unit_price),
          sale_date: formData.sale_date,
          payment_type: formData.payment_type,
        },
        url: `${endPoints.sales}/${id}`,
      },
      {
        onSuccess: () => {
          toast.success("اتحدثت بيانات المبيعات بنجاح");
          router.back();
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message || "حصل خطأ في تحديث بيانات المبيعات";
          toast.error(errorMessage);
        },
      },
    );
  };

  if (isFetching) {
    return (
      <AppScreen scrollable={false}>
        <AppLoading fullScreen message="بيت حمّل بيانات المبيعات..." />
      </AppScreen>
    );
  }

  if (isFetchError) {
    return (
      <AppScreen scrollable={false}>
        <AppError
          fullScreen
          title="حصل خطأ في تحميل البيانات"
          message="مقدرناش نوصل لـ بيانات المبيعات المطلوبة."
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
          <AppText variant="h1">تعديل المبيعات</AppText>
          <AppText variant="bodySmall" muted>
            تحديث معلومات: {saleData?.item_name}
          </AppText>
        </View>
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
