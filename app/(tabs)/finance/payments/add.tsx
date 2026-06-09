import AppButton from "@/src/components/custom/AppButton";
import AppDatePicker from "@/src/components/custom/AppDatePicker";
import AppInput from "@/src/components/custom/AppInput";
import AppScreen from "@/src/components/custom/AppScreen";
import AppSelect from "@/src/components/custom/AppSelect";
import AppText from "@/src/components/custom/AppText";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useGetAllCustomers } from "@/src/hooks/Actions/customers/useCurdCustomers";
import { useAddPayment } from "@/src/hooks/Actions/payments/useCurdPayments";
import { useGetAllPurchases } from "@/src/hooks/Actions/purchases/useCurdPurchases";
import { useGetAllSales } from "@/src/hooks/Actions/sales/useCurdSales";
import { useGetAllSuppliers } from "@/src/hooks/Actions/suppliers/useCurdSuppliers";
import { toast } from "@/src/services/toast";
import { paymentSchema } from "@/src/validationSchema/payments/payments";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import {
  Building2,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  HandCoins,
  Receipt,
  User,
} from "lucide-react-native";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Pressable, View } from "react-native";
import type { z } from "zod";

type PaymentFormData = z.infer<typeof paymentSchema>;
type PaymentType = "to_supplier" | "from_customer";

const paymentTypeCards: {
  value: PaymentType;
  title: string;
  description: string;
  icon: typeof HandCoins;
}[] = [
  {
    value: "to_supplier",
    title: "دفع لمورد",
    description: "تسجيل دفعة مرتبطة بمورد وفاتورة شراء",
    icon: Building2,
  },
  {
    value: "from_customer",
    title: "تحصيل من عميل",
    description: "تسجيل تحصيل مرتبط بعميل وفاتورة بيع",
    icon: User,
  },
];

const paymentMethodOptions = [
  { label: "نقداً", value: "cash" },
  { label: "تحويل بنكي", value: "bank_transfer" },
  { label: "محفظة إلكترونية", value: "wallet" },
];

export default function AddPaymentPage() {
  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
    defaultValues: {
      type: "to_supplier",
      supplier_id: "",
      purchase_id: "",
      customer_id: "",
      sale_id: "",
      amount: "",
      payment_date: "",
      payment_method: "cash",
      notes: "",
    },
  });

  const selectedType = useWatch({ control, name: "type" }) as PaymentType;
  const isToSupplier = selectedType === "to_supplier";

  const { data: suppliers, isPending: suppliersIsPending } =
    useGetAllSuppliers();
  const { data: customers, isPending: customersIsPending } =
    useGetAllCustomers();
  const { data: purchases, isPending: purchasesIsPending } =
    useGetAllPurchases();
  const { data: sales, isPending: salesIsPending } = useGetAllSales();
  const { mutate, isPending } = useAddPayment();

  const supplierOptions = (suppliers?.data?.data ?? []).map((supplier) => ({
    label: supplier.name,
    value: supplier.id,
  }));

  const customerOptions = (customers?.data?.data ?? []).map((customer) => ({
    label: customer.name,
    value: customer.id,
  }));

  const purchaseOptions = (purchases?.data?.data ?? []).map((purchase) => ({
    label: `#${purchase.id} - ${purchase.item_name} - ${Number(
      purchase.total_price,
    ).toLocaleString()} ج.م`,
    value: purchase.id,
  }));

  const saleOptions = (sales?.data?.data ?? []).map((sale) => ({
    label: `#${sale.id} - ${sale.item_name} - ${Number(
      sale.total_price,
    ).toLocaleString()} ج.م`,
    value: sale.id,
  }));

  const handleTypeChange = (type: PaymentType) => {
    setValue("type", type, { shouldDirty: true, shouldValidate: true });

    if (type === "to_supplier") {
      setValue("customer_id", "", { shouldDirty: true, shouldValidate: true });
      setValue("sale_id", "", { shouldDirty: true, shouldValidate: true });
      return;
    }

    setValue("supplier_id", "", { shouldDirty: true, shouldValidate: true });
    setValue("purchase_id", "", { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = (data: PaymentFormData) => {
    const basePayload = {
      type: data.type,
      amount: Number(data.amount),
      payment_date: data.payment_date,
      payment_method: data.payment_method,
      notes: data.notes || "",
    };

    const payload =
      data.type === "to_supplier"
        ? {
            ...basePayload,
            supplier_id: Number(data.supplier_id),
            purchase_id: Number(data.purchase_id),
          }
        : {
            ...basePayload,
            customer_id: Number(data.customer_id),
            sale_id: Number(data.sale_id),
          };

    mutate({
      data: payload,
      disableSuccessToast: true,
      onSuccess: () => {
        toast.success("تمت إضافة الدفعة بنجاح");
        router.back();
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
          سجل دفعة لمورد أو تحصيل من عميل
        </AppText>
      </View>

      <View className="p-2">
        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            نوع الدفعة
          </AppText>
          <View className="flex-row gap-3">
            {paymentTypeCards.map((card) => {
              const Icon = card.icon;
              const active = selectedType === card.value;

              return (
                <Pressable
                  key={card.value}
                  onPress={() => handleTypeChange(card.value)}
                  className={`flex-1 min-h-[118px] rounded-xl border p-4 ${
                    active
                      ? "border-primary-light dark:border-primary-dark bg-primary-light/10 dark:bg-primary-dark/10"
                      : "border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark"
                  }`}
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View
                      className={`h-9 w-9 rounded-full items-center justify-center ${
                        active
                          ? "bg-primary-light dark:bg-primary-dark"
                          : "bg-muted-light dark:bg-muted-dark"
                      }`}
                    >
                      <Icon
                        size={18}
                        color={active ? colors.background : colors.text}
                      />
                    </View>
                    <View
                      className="h-5 w-5 rounded-full border-2 items-center justify-center"
                      style={{
                        borderColor: active
                          ? colors.primary
                          : colors.mutedForeground,
                      }}
                    >
                      {active && (
                        <View
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: colors.primary }}
                        />
                      )}
                    </View>
                  </View>
                  <AppText variant="h3" className="text-right">
                    {card.title}
                  </AppText>
                  <AppText
                    variant="bodySmall"
                    muted={!active}
                    className="text-right mt-1"
                  >
                    {card.description}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {isToSupplier ? (
          <>
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
                    placeholder="اختر المورد"
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

            <View className="mb-5">
              <AppText variant="label" className="mb-2">
                فاتورة الشراء
              </AppText>
              <Controller
                control={control}
                name="purchase_id"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppSelect
                    leftIcon={
                      <Receipt size={18} color={colors.mutedForeground} />
                    }
                    placeholder="اختر فاتورة الشراء"
                    options={purchaseOptions}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={errors.purchase_id?.message}
                    loading={purchasesIsPending}
                  />
                )}
              />
            </View>
          </>
        ) : (
          <>
            <View className="mb-5">
              <AppText variant="label" className="mb-2">
                العميل
              </AppText>
              <Controller
                control={control}
                name="customer_id"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppSelect
                    leftIcon={<User size={18} color={colors.mutedForeground} />}
                    placeholder="اختر العميل"
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

            <View className="mb-5">
              <AppText variant="label" className="mb-2">
                فاتورة البيع
              </AppText>
              <Controller
                control={control}
                name="sale_id"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppSelect
                    leftIcon={
                      <FileText size={18} color={colors.mutedForeground} />
                    }
                    placeholder="اختر فاتورة البيع"
                    options={saleOptions}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={errors.sale_id?.message}
                    loading={salesIsPending}
                  />
                )}
              />
            </View>
          </>
        )}

        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            المبلغ
          </AppText>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                keyboardType="decimal-pad"
                rightIcon={<DollarSign size={18} color={colors.mutedForeground} />}
                placeholder="0.00"
                error={errors.amount?.message}
                textAlign="right"
                value={String(value ?? "")}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        <View className="mb-5">
          <Controller
            control={control}
            name="payment_date"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppDatePicker
                leftIcon={<Calendar size={18} color={colors.mutedForeground} />}
                placeholder="اختر تاريخ الدفع"
                label="تاريخ الدفع"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.payment_date?.message}
              />
            )}
          />
        </View>

        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            طريقة الدفع
          </AppText>
          <Controller
            control={control}
            name="payment_method"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppSelect
                leftIcon={
                  <CreditCard size={18} color={colors.mutedForeground} />
                }
                placeholder="اختر طريقة الدفع"
                options={paymentMethodOptions}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.payment_method?.message}
              />
            )}
          />
        </View>

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
                placeholder="أضف ملاحظات اختيارية"
                error={errors.notes?.message}
                textAlign="right"
                value={String(value ?? "")}
                onBlur={onBlur}
                onChangeText={onChange}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                className="min-h-[96px]"
              />
            )}
          />
        </View>

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
