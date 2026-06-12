import AppButton from "@/src/components/custom/AppButton";
import AppDatePicker from "@/src/components/custom/AppDatePicker";
import AppInput from "@/src/components/custom/AppInput";
import AppScreen from "@/src/components/custom/AppScreen";
import AppSelect from "@/src/components/custom/AppSelect";
import AppText from "@/src/components/custom/AppText";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useGetAllSuppliers } from "@/src/hooks/Actions/suppliers/useCurdSuppliers";
import { useGetAllBatches } from "@/src/hooks/Actions/batch/useCurdBatch";
import { useAddPurchase } from "@/src/hooks/Actions/purchases/useCurdPurchases";
import { purchaseSchema } from "@/src/validationSchema/purchase/purchase";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import {
  Bird,
  Building2,
  Calendar,
  DollarSign,
  Hash,
  Layers,
} from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import type { z } from "zod";
import { toast } from "@/src/services/toast";
import {
  poultryTypeOptions,
  paymentTypeOptions,
  purchaseTypeOptions,
} from "@/src/constants/poultryTypes";

type PurchaseFormData = z.infer<typeof purchaseSchema>;

export default function AddPurchasePage() {
  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
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
  const { mutate, isPending } = useAddPurchase();

  const supplierOptions = (suppliers?.data?.data ?? []).map((s) => ({
    label: s.name,
    value: s.id,
  }));

  const batchOptions = (batches?.data?.data ?? []).map((b) => ({
    label: `${b.poultry_type} - #${b.id}`,
    value: b.id,
  }));

  const onSubmit = (data: PurchaseFormData) => {
    mutate({
      data: {
        supplier_id: Number(data.supplier_id),
        type: data.type,
        batch_id: Number(data.batch_id),
        item_name: data.item_name,
        quantity: Number(data.quantity),
        unit_price: Number(data.unit_price),
        purchase_date: data.purchase_date,
        payment_type: data.payment_type,
      },
      onSuccess: () => {
        toast.success("اتضافت المشتريات بنجاح");
        router.back();
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message || "حصل خطأ في إضافة المشتريات";
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
        <AppText variant="h1">إضافة مشتريات جديدة</AppText>
        <AppText variant="body" muted className="mt-1">
          اكتب بيانات المشتريات الجديدة لإضافتها إلى النظام
        </AppText>
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
              disabled={isPending}
            >
              إلغاء
            </AppButton>
          </View>
          <View className="flex-[2]">
            <AppButton loading={isPending} onPress={handleSubmit(onSubmit)}>
              إضافة المشتريات
            </AppButton>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}
