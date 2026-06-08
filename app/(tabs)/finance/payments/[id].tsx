import { View, TouchableOpacity, ScrollView, Linking } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  ArrowRightLeft,
  Building2,
  Calendar,
  ChevronRight,
  CreditCard,
  DollarSign,
  Edit2,
  ExternalLink,
  FileText,
  Hash,
  Info,
  MapPin,
  Phone,
  Receipt,
  ShoppingCart,
  Trash2,
  User,
  Wallet,
} from "lucide-react-native";
import AppError from "@/src/components/custom/AppError";
import AppLoading from "@/src/components/custom/AppLoading";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import AppDeleteModal from "@/src/components/custom/AppDeleteModal";
import { Card } from "@/src/components/ui/Card";
import {
  useGetPaymentById,
  useDeletePayment,
} from "@/src/hooks/Actions/payments/useCurdPayments";
import { useTheme } from "@/src/contexts/ThemeContext";
import { useState } from "react";
import { toast } from "@/src/services/toast";
import endPoints from "@/src/hooks/EndPoints/endPoints";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const typeConfig: Record<
  string,
  { label: string; icon: any; badgeClass: string; textClass: string }
> = {
  to_supplier: {
    label: "دفع لمورد",
    icon: Building2,
    badgeClass:
      "bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20",
    textClass: "text-rose-600 dark:text-rose-400",
  },
  from_customer: {
    label: "تحصيل من عميل",
    icon: User,
    badgeClass:
      "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20",
    textClass: "text-emerald-600 dark:text-emerald-400",
  },
};

const methodLabels: Record<string, string> = {
  cash: "نقداً",
  bank_transfer: "تحويل بنكي",
  cheque: "شيك",
};

const InfoRow = ({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: any;
  color?: string;
}) => {
  const { colors } = useTheme();
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-border-light/50 dark:border-border-dark/50 last:border-0">
      <View className="flex-row items-center gap-2.5">
        <View className="w-8 h-8 rounded-lg bg-muted-light dark:bg-muted-dark items-center justify-center">
          <Icon size={16} color={color || colors.mutedForeground} />
        </View>
        <AppText variant="bodySmall" muted>
          {label}
        </AppText>
      </View>
      <AppText className="font-semibold">{value}</AppText>
    </View>
  );
};

const SectionHeader = ({ title, icon: Icon }: { title: string; icon: any }) => {
  const { colors } = useTheme();
  return (
    <View className="flex-row items-center gap-2 mb-4">
      <View className="w-1.5 h-6 rounded-full bg-primary-light dark:bg-primary-dark" />
      <Icon size={18} color={colors.text} />
      <AppText variant="h3">{title}</AppText>
    </View>
  );
};

const PaymentDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: payment,
    isPending,
    isError,
    refetch,
  } = useGetPaymentById(id || "");
  const { mutate: deletePayment, isPending: isDeleting } = useDeletePayment();
  const { colors } = useTheme();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const paymentData = payment?.data?.data;
  const isToSupplier = paymentData?.type === "to_supplier";
  const supplier = paymentData?.supplier;
  const customer = paymentData?.customer;
  const purchase = paymentData?.purchase;
  const sale = paymentData?.sale;

  const handleDelete = () => {
    deletePayment(
      { id: id as string, url: `${endPoints.payments}/${id}` },
      {
        onSuccess: () => {
          setShowDeleteModal(false);
          toast.success("تم حذف الدفعة بنجاح");
          router.replace("/finance/payments");
        },
        onError: (error: any) => {
          setShowDeleteModal(false);
          const errorMessage =
            error?.response?.data?.message || "فشل في حذف الدفعة";
          toast.error(errorMessage);
        },
      },
    );
  };

  if (isPending) {
    return (
      <AppScreen
        className="bg-background-light dark:bg-background-dark"
        scrollable={false}
      >
        <AppLoading fullScreen message="جاري تحميل الدفعة..." />
      </AppScreen>
    );
  }

  if (isError) {
    return (
      <AppScreen
        className="bg-background-light dark:bg-background-dark"
        scrollable={false}
      >
        <AppError
          fullScreen
          title="فشل التحميل"
          message="تعذر تحميل بيانات الدفعة."
          onRetry={refetch}
          onBack={() => router.back()}
        />
      </AppScreen>
    );
  }

  const type = typeConfig[paymentData?.type || ""] || typeConfig.to_supplier;

  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="px-4 pt-8 pb-12"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="flex-row items-start justify-between mb-6">
          <View className="flex-1">
            <AppText
              variant="caption"
              muted
              className="mb-1 uppercase tracking-wider"
            >
              رقم العملية #{paymentData?.id}
            </AppText>
            <View className="mb-2">
              <AppText variant="h1">
                {Number(paymentData?.amount || 0).toLocaleString()} ج.م
              </AppText>
            </View>
          
            <View className="flex-row items-center gap-1.5 ">
              <Calendar size={14} color={colors.mutedForeground} />
              <AppText variant="caption" muted>
                {formatDate(paymentData?.payment_date || "")}
              </AppText>
            </View>
              <View className="flex-row items-center gap-2 mt-2">
              <View
                className={`flex-row items-center gap-1.5 px-3 py-1 rounded-full ${type.badgeClass}`}
              >
                <AppText
                  className={`text-[12px] font-bold ${type.textClass}`}
                >
                  {type.label}
                </AppText>
              </View>
            </View>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setShowDeleteModal(true)}
              className="w-11 h-11 rounded-2xl items-center justify-center bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20"
            >
              <Trash2 size={20} color="#f43f5e" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Amount Overview Card */}
        <View className="bg-primary-light dark:bg-primary-dark rounded-[32px] p-6 mb-8 shadow-xl">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <AppText inverse variant="caption" className="opacity-70 mb-1">
                المبلغ
              </AppText>
              <AppText inverse className="text-3xl font-bold">
                {Number(paymentData?.amount || 0).toLocaleString()}{" "}
                <AppText inverse variant="bodySmall" className="opacity-70">
                  ج.م
                </AppText>
              </AppText>
            </View>
            <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center">
              <Wallet size={24} color="white" />
            </View>
          </View>

          <View className="h-[1px] bg-white/10 mb-4" />

          <View className="flex-row items-center gap-2">
            <View className="w-2 h-2 rounded-full bg-blue-400" />
            <AppText inverse variant="caption" className="opacity-70">
              {methodLabels[paymentData?.payment_method || ""] ||
                paymentData?.payment_method ||
                "---"}
            </AppText>
          </View>
        </View>

        {/* Party Section */}
        <SectionHeader
          title={isToSupplier ? "بيانات المورد" : "بيانات العميل"}
          icon={type.icon}
        />
        <Card className="p-4 mb-6">
          {isToSupplier && supplier ? (
            <>
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 rounded-full bg-primary-light/5 dark:bg-primary-dark/5 items-center justify-center">
                    <AppText className="text-xl font-bold text-primary-light dark:text-primary-dark">
                      {supplier.name.charAt(0).toUpperCase()}
                    </AppText>
                  </View>
                  <View>
                    <AppText className="font-bold text-lg">
                      {supplier.name}
                    </AppText>
                    <AppText variant="caption" muted>
                      مورد
                    </AppText>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    router.push(
                      `/more/suppliers/${supplier?.id}` as any,
                    )
                  }
                  className="w-10 h-10 rounded-full bg-muted-light dark:bg-muted-dark items-center justify-center"
                >
                  <ChevronRight size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              {supplier.phone && (
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(`tel:${supplier.phone}`)
                  }
                  className="flex-row items-center gap-2 mb-3 bg-muted-light dark:bg-muted-dark p-3 rounded-xl"
                >
                  <Phone size={16} color={colors.primary} />
                  <AppText variant="bodySmall">
                    {supplier.phone}
                  </AppText>
                  <View className="flex-1" />
                  <ExternalLink size={14} color={colors.mutedForeground} />
                </TouchableOpacity>
              )}

              {supplier.address && (
                <View className="flex-row items-center gap-2 bg-muted-light dark:bg-muted-dark p-3 rounded-xl">
                  <MapPin size={16} color={colors.primary} />
                  <AppText variant="bodySmall" className="flex-1">
                    {supplier.address}
                  </AppText>
                </View>
              )}
            </>
          ) : customer ? (
            <>
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 rounded-full bg-primary-light/5 dark:bg-primary-dark/5 items-center justify-center">
                    <AppText className="text-xl font-bold text-primary-light dark:text-primary-dark">
                      {customer.name.charAt(0).toUpperCase()}
                    </AppText>
                  </View>
                  <View>
                    <AppText className="font-bold text-lg">
                      {customer.name}
                    </AppText>
                    <AppText variant="caption" muted>
                      عميل
                    </AppText>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    router.push(
                      `/more/customers/${customer?.id}` as any,
                    )
                  }
                  className="w-10 h-10 rounded-full bg-muted-light dark:bg-muted-dark items-center justify-center"
                >
                  <ChevronRight size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              {customer.phone && (
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(`tel:${customer.phone}`)
                  }
                  className="flex-row items-center gap-2 mb-3 bg-muted-light dark:bg-muted-dark p-3 rounded-xl"
                >
                  <Phone size={16} color={colors.primary} />
                  <AppText variant="bodySmall">
                    {customer.phone}
                  </AppText>
                  <View className="flex-1" />
                  <ExternalLink size={14} color={colors.mutedForeground} />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <AppText muted>لا توجد بيانات</AppText>
          )}
        </Card>

        {/* Payment Details */}
        <SectionHeader title="تفاصيل الدفعة" icon={Receipt} />
        <Card className="p-4 mb-6">
          <InfoRow
            label="طريقة الدفع"
            value={
              methodLabels[paymentData?.payment_method || ""] ||
              paymentData?.payment_method ||
              "---"
            }
            icon={CreditCard}
          />
          <InfoRow
            label="التاريخ"
            value={formatDate(paymentData?.payment_date || "")}
            icon={Calendar}
            color={colors.primary}
          />
          {paymentData?.notes && (
            <InfoRow
              label="ملاحظات"
              value={paymentData?.notes || "---"}
              icon={FileText}
            />
          )}
        </Card>

        {/* Related Invoice */}
        {isToSupplier && purchase && (
          <>
            <SectionHeader title="فاتورة المشتريات" icon={ShoppingCart} />
            <Card className="p-4 mb-6">
              <TouchableOpacity
                onPress={() =>
                  router.push(
                    `/finance/purchases/${purchase?.id}` as any,
                  )
                }
                className="flex-row items-center justify-between"
              >
                <View className="flex-1">
                  <AppText className="font-bold text-lg">
                    {purchase.item_name}
                  </AppText>
                  <AppText variant="caption" muted>
                    {Number(
                      purchase.total_price,
                    ).toLocaleString()}{" "}
                    ج.م
                  </AppText>
                </View>
                <ChevronRight size={20} color={colors.text} />
              </TouchableOpacity>
            </Card>
          </>
        )}

        {!isToSupplier && sale && (
          <>
            <SectionHeader title="فاتورة المبيعات" icon={ShoppingCart} />
            <Card className="p-4 mb-6">
              <TouchableOpacity
                onPress={() =>
                  router.push(
                    `/finance/sales/${sale?.id}` as any,
                  )
                }
                className="flex-row items-center justify-between"
              >
                <View className="flex-1">
                  <AppText className="font-bold text-lg">
                    فاتورة مبيعات #{sale.id}
                  </AppText>
                  <AppText variant="caption" muted>
                    {Number(
                      sale.total_price,
                    ).toLocaleString()}{" "}
                    ج.م
                  </AppText>
                </View>
                <ChevronRight size={20} color={colors.text} />
              </TouchableOpacity>
            </Card>
          </>
        )}
      </ScrollView>

      <AppDeleteModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="حذف الدفعة؟"
        description="هل أنت متأكد من رغبتك في حذف هذه الدفعة؟"
      />
    </AppScreen>
  );
};

export default PaymentDetailPage;
