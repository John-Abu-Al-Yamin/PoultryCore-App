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
  Building2,
  Calendar,
  ChevronRight,
  DollarSign,
  Hash,
  Layers,
} from "lucide-react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { purchaseSchema } from "@/src/validationSchema/purchase/purchase";
import {
  useGetPurchaseById,
  useUpdatePurchase,
} from "@/src/hooks/Actions/purchases/useCurdPurchases";
import { useGetAllSuppliers } from "@/src/hooks/Actions/suppliers/useCurdSuppliers";
import { useGetAllBatches } from "@/src/hooks/Actions/batch/useCurdBatch";
import { router, useLocalSearchParams } from "expo-router";
import { toast } from "@/src/services/toast";
import { useEffect } from "react";
import endPoints from "@/src/hooks/EndPoints/endPoints";
import {
  poultryTypeOptions,
  paymentTypeOptions,
  purchaseTypeOptions,
} from "@/src/constants/poultryTypes";

type PurchaseFormData = z.infer<typeof purchaseSchema>;

export default function EditPurchasePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  const {
    data: purchaseResponse,
    isPending: isFetching,
    isError: isFetchError,
    refetch,
  } = useGetPurchaseById(id || "");

  const purchaseData = purchaseResponse?.data?.data;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    mode: "onChange",
    defaultValues: {
      supplier_id: "",
      type: "chicks",
      batch_id: "",
      item_name: "",
      quantity: "",
      unit_price: "",
      purchase_date: "",
      payment_type: "",
    },
  });

  const { data: suppliers, isPending: suppliersIsPending } =
    useGetAllSuppliers();
  const { data: batches, isPending: batchesIsPending } = useGetAllBatches();

  useEffect(() => {
    if (purchaseData) {
      reset({
        supplier_id: purchaseData.supplier_id,
        type: purchaseData.type,
        batch_id: purchaseData.batch_id,
        item_name: purchaseData.item_name,
        quantity: String(purchaseData.quantity),
        unit_price: purchaseData.unit_price,
        purchase_date: purchaseData.purchase_date,
        payment_type: purchaseData.payment_type,
      });
    }
  }, [purchaseData, reset]);

  const { mutate, isPending: isUpdating } = useUpdatePurchase();

  const supplierOptions = (suppliers?.data?.data ?? []).map((s) => ({
    label: s.name,
    value: s.id,
  }));

  const batchOptions = (batches?.data?.data ?? []).map((b) => ({
    label: `${b.poultry_type} - #${b.id}`,
    value: b.id,
  }));

  const onSubmit = (formData: PurchaseFormData) => {
    mutate(
      {
        id: id as string,
        data: {
          supplier_id: Number(formData.supplier_id),
          type: formData.type,
          batch_id: Number(formData.batch_id),
          item_name: formData.item_name,
          quantity: Number(formData.quantity),
          unit_price: Number(formData.unit_price),
          purchase_date: formData.purchase_date,
          payment_type: formData.payment_type,
        },
        url: `${endPoints.purchases}/${id}`,
      },
      {
        onSuccess: () => {
          toast.success("اتحدثت بيانات المشتريات بنجاح");
          router.back();
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message || "حصل خطأ في تحديث بيانات المشتريات";
          toast.error(errorMessage);
        },
      },
    );
  };

  if (isFetching) {
    return (
      <AppScreen scrollable={false}>
        <AppLoading fullScreen message="بيت حمّل بيانات المشتريات..." />
      </AppScreen>
    );
  }

  if (isFetchError) {
    return (
      <AppScreen scrollable={false}>
        <AppError
          fullScreen
          title="حصل خطأ في تحميل البيانات"
          message="مقدرناش نوصل لـ بيانات المشتريات المطلوبة."
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
          <AppText variant="h1">تعديل المشتريات</AppText>
          <AppText variant="bodySmall" muted>
            تحديث معلومات: {purchaseData?.item_name}
          </AppText>
        </View>
      </View>

      <View className="p-2">
        {/* Supplier */}
        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            المورد
          </AppText>
          <Controller
            control={control}
            name="supplier_id"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppSelect
                leftIcon={
                  <Building2 size={18} color={colors.mutedForeground} />
                }
                placeholder="اختار المورّد"
                options={supplierOptions}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.supplier_id?.message}
                loading={suppliersIsPending}
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

        {/* Type */}
        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            نوع المشتريات
          </AppText>
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppSelect
                leftIcon={<Bird size={18} color={colors.mutedForeground} />}
                placeholder="اختار نوع المشتريات"
                options={purchaseTypeOptions}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.type?.message}
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

        {/* Purchase date */}
        <View className="mb-8">
          <Controller
            control={control}
            name="purchase_date"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppDatePicker
                leftIcon={<Calendar size={18} color={colors.mutedForeground} />}
                placeholder="اختار تاريخ الشراء"
                label="تاريخ الشراء"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.purchase_date?.message}
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
