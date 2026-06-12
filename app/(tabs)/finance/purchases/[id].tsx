import { View, TouchableOpacity, ScrollView, Linking } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  Banknote,
  Building2,
  Calendar,
  ChevronRight,
  CreditCard,
  DollarSign,
  Edit2,
  ExternalLink,
  Hash,
  Info,
  Layers,
  MapPin,
  Package,
  Phone,
  Receipt,
  Trash2,
  Wallet,
} from "lucide-react-native";
import AppError from "@/src/components/custom/AppError";
import AppLoading from "@/src/components/custom/AppLoading";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import AppDeleteModal from "@/src/components/custom/AppDeleteModal";
import { Card } from "@/src/components/ui/Card";
import {
  useGetPurchaseById,
  useDeletePurchase,
} from "@/src/hooks/Actions/purchases/useCurdPurchases";
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

const statusConfig: Record<
  string,
  { label: string; badgeClass: string; textClass: string; dotClass: string }
> = {
  paid: {
    label: "مدفوع",
    badgeClass:
      "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20",
    textClass: "text-emerald-600 dark:text-emerald-400",
    dotClass: "bg-emerald-600 dark:bg-emerald-400",
  },
  unpaid: {
    label: "مش مدفوع",
    badgeClass:
      "bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20",
    textClass: "text-rose-600 dark:text-rose-400",
    dotClass: "bg-rose-600 dark:bg-rose-400",
  },
  partial: {
    label: "مدفوع جزء منه",
    badgeClass:
      "bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20",
    textClass: "text-amber-600 dark:text-amber-400",
    dotClass: "bg-amber-600 dark:bg-amber-400",
  },
};

const typeConfig: Record<string, { label: string; badgeClass: string; textClass: string; classification: string }> = {
  chicks: {
    label: "كتاكيت",
    badgeClass: "bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20",
    textClass: "text-sky-600 dark:text-sky-400",
    classification: "بيأثر على عدد الدفعة",
  },
  feed: {
    label: "علف",
    badgeClass: "bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20",
    textClass: "text-amber-600 dark:text-amber-400",
    classification: "تكلفة تشغيلية",
  },
  medicine: {
    label: "دوّا",
    badgeClass: "bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20",
    textClass: "text-purple-600 dark:text-purple-400",
    classification: "تكلفة تشغيلية",
  },
  other: {
    label: "تاني",
    badgeClass: "bg-gray-50 dark:bg-gray-500/10 border border-gray-100 dark:border-gray-500/20",
    textClass: "text-gray-600 dark:text-gray-400",
    classification: "تكلفة تشغيلية",
  },
};

const paymentTypeLabels: Record<string, string> = {
  cash: "نقداً",
  credit: "آجل",
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

const PurchaseDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: purchase,
    isPending,
    isError,
    refetch,
  } = useGetPurchaseById(id || "");
  const { mutate: deletePurchase, isPending: isDeleting } = useDeletePurchase();
  const { colors } = useTheme();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const purchaseDetails = purchase?.data?.data;
  const totalPrice = Number(purchaseDetails?.total_price || 0);
  const paidAmount = Number(purchaseDetails?.paid_amount || 0);
  const remainingAmount = totalPrice - paidAmount;

  const handleDelete = () => {
    deletePurchase(
      { id: id as string, url: `${endPoints.purchases}/${id}` },
      {
        onSuccess: () => {
          setShowDeleteModal(false);
          toast.success("اتمسحت المشتريات بنجاح");
          router.replace("/finance/purchases");
        },
        onError: (error: any) => {
          setShowDeleteModal(false);
          const errorMessage =
            error?.response?.data?.message || "حصل خطأ في حذف المشتريات";
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
        <AppLoading fullScreen message="بيت حمّل المشتريات..." />
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
          title="حصل خطأ في التحميل"
          message="مقدرناش نحمل بيانات المشتريات."
          onRetry={refetch}
          onBack={() => router.back()}
        />
      </AppScreen>
    );
  }

  const status =
    statusConfig[purchaseDetails?.status || ""] || statusConfig.unpaid;

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
              رقم العملية #{purchaseDetails?.id}
            </AppText>
            <AppText variant="h1" className="mb-2">
              {purchaseDetails?.item_name}
            </AppText>
            <View className="flex-row items-center gap-3">
              <View
                className={`flex-row items-center gap-1.5 px-3 py-1 rounded-full ${status.badgeClass}`}
              >
                <View
                  className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`}
                />
                <AppText
                  className={`text-[12px] font-bold ${status.textClass}`}
                >
                  {status.label}
                </AppText>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Calendar size={14} color={colors.mutedForeground} />
                <AppText variant="caption" muted>
                  {formatDate(purchaseDetails?.purchase_date || "")}
                </AppText>
              </View>
            </View>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setShowDeleteModal(true)}
              disabled={purchaseDetails?.status === "paid"}
              className={`w-11 h-11 rounded-2xl items-center justify-center ${
                purchaseDetails?.status === "paid"
                  ? "bg-muted-light dark:bg-muted-dark border border-border-light dark:border-border-dark opacity-40"
                  : "bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20"
              }`}
            >
              <Trash2
                size={20}
                color={
                  purchaseDetails?.status === "paid"
                    ? colors.mutedForeground
                    : "#f43f5e"
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                router.push(`/finance/purchases/edit/${id}` as any)
              }
              disabled={purchaseDetails?.status === "paid"}
              className={`w-11 h-11 rounded-2xl items-center justify-center ${
                purchaseDetails?.status === "paid"
                  ? "bg-muted-light dark:bg-muted-dark border border-border-light dark:border-border-dark opacity-40"
                  : "bg-muted-light dark:bg-muted-dark border border-border-light dark:border-border-dark"
              }`}
            >
              <Edit2
                size={20}
                color={
                  purchaseDetails?.status === "paid"
                    ? colors.mutedForeground
                    : colors.text
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Financial Overview Card */}
        <View className="bg-primary-light dark:bg-primary-dark rounded-[32px] p-6 mb-8 shadow-xl">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <AppText inverse variant="caption" className="opacity-70 mb-1">
                إجمالي المبلغ
              </AppText>
              <AppText inverse className="text-3xl font-bold">
                {totalPrice.toLocaleString()}{" "}
                <AppText inverse variant="bodySmall" className="opacity-70">
                  ج.م
                </AppText>
              </AppText>
            </View>
            <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center">
              <Receipt size={24} color="white" />
            </View>
          </View>

          <View className="h-[1px] bg-white/10 mb-6" />

          <View className="flex-row gap-4">
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5 mb-1">
                <View className="w-2 h-2 rounded-full bg-emerald-400" />
                <AppText inverse variant="caption" className="opacity-70">
                  المدفوع
                </AppText>
              </View>
              <AppText inverse className="text-lg font-bold">
                {paidAmount.toLocaleString()}
              </AppText>
            </View>
            <View className="w-[1px] bg-white/10" />
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5 mb-1">
                <View className="w-2 h-2 rounded-full bg-amber-400" />
                <AppText inverse variant="caption" className="opacity-70">
                  المتبقي
                </AppText>
              </View>
              <AppText inverse className="text-lg font-bold">
                {remainingAmount.toLocaleString()}
              </AppText>
            </View>
          </View>
        </View>

        {/* Supplier Section */}
        <SectionHeader title="معلومات المورد" icon={Building2} />
        <Card className="p-4 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-full bg-primary-light/5 dark:bg-primary-dark/5 items-center justify-center">
                <AppText className="text-xl font-bold text-primary-light dark:text-primary-dark">
                  {purchaseDetails?.supplier?.name?.charAt(0).toUpperCase() ||
                    "S"}
                </AppText>
              </View>
              <View>
                <AppText className="font-bold text-lg">
                  {purchaseDetails?.supplier?.name || "---"}
                </AppText>
                <AppText variant="caption" muted>
                  مورّد
                </AppText>
              </View>
            </View>
            <TouchableOpacity
              onPress={() =>
                router.push(
                  `/more/suppliers/${purchaseDetails?.supplier_id}` as any,
                )
              }
              className="w-10 h-10 rounded-full bg-muted-light dark:bg-muted-dark items-center justify-center"
            >
              <ChevronRight size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {purchaseDetails?.supplier?.phone && (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(`tel:${purchaseDetails.supplier.phone}`)
              }
              className="flex-row items-center gap-2 mb-3 bg-muted-light dark:bg-muted-dark p-3 rounded-xl"
            >
              <Phone size={16} color={colors.primary} />
              <AppText variant="bodySmall">
                {purchaseDetails.supplier.phone}
              </AppText>
              <View className="flex-1" />
              <ExternalLink size={14} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}

          {purchaseDetails?.supplier?.address && (
            <View className="flex-row items-center gap-2 bg-muted-light dark:bg-muted-dark p-3 rounded-xl">
              <MapPin size={16} color={colors.primary} />
              <AppText variant="bodySmall" className="flex-1">
                {purchaseDetails.supplier.address}
              </AppText>
            </View>
          )}
        </Card>

        {/* Batch & Item Details */}
        <SectionHeader title="تفاصيل العملية" icon={Package} />
        <Card className="p-4 mb-6">
          <InfoRow
            label="الدفعة المرتبطة"
            value={`Batch #${purchaseDetails?.batch_id} - ${purchaseDetails?.batch?.poultry_type || "---"}`}
            icon={Layers}
            color={colors.primary}
          />
          <InfoRow
            label="نوع المشتريات"
            value={typeConfig[purchaseDetails?.type || ""]?.label || "---"}
            icon={Package}
          />
          <InfoRow
            label="نوع التكلفة"
            value={typeConfig[purchaseDetails?.type || ""]?.classification || "---"}
            icon={Info}
            color={purchaseDetails?.type === "chicks" ? colors.primary : colors.mutedForeground}
          />
          <InfoRow
            label="الكمية"
            value={`${purchaseDetails?.quantity} `}
            icon={Hash}
          />
          <InfoRow
            label="سعر الوحدة"
            value={`${Number(purchaseDetails?.unit_price || 0).toLocaleString()} ج.م`}
            icon={DollarSign}
          />
          <InfoRow
            label="طريقة الدفع"
            value={
              paymentTypeLabels[purchaseDetails?.payment_type || ""] ||
              purchaseDetails?.payment_type ||
              "---"
            }
            icon={Wallet}
          />
        </Card>

        {/* Payment History */}
        <SectionHeader title="سجل المدفوعات" icon={CreditCard} />
        {purchaseDetails?.payments && purchaseDetails.payments.length > 0 ? (
          <View className="gap-3">
            {purchaseDetails.payments.map((payment: any, index: number) => (
              <Card
                key={payment.id}
                className="p-4 border-l-4 border-emerald-500"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <View className="flex-row items-center gap-2 mb-1">
                      <AppText className="font-bold text-lg">
                        {Number(payment.amount).toLocaleString()} ج.م
                      </AppText>
                      <View className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-md">
                        <AppText className="text-[10px] text-emerald-600 font-bold uppercase">
                          {payment.payment_method}
                        </AppText>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-1.5">
                      <Calendar size={12} color={colors.mutedForeground} />
                      <AppText variant="caption" muted>
                        {formatDate(payment.payment_date)}
                      </AppText>
                    </View>
                  </View>
                  <View className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 items-center justify-center">
                    <Banknote size={20} color="#10b981" />
                  </View>
                </View>
                {payment.notes && (
                  <View className="mt-3 pt-3 border-t border-border-light/50 dark:border-border-dark/50 flex-row items-center gap-2">
                    <Info size={14} color={colors.mutedForeground} />
                    <AppText variant="caption" muted className="italic">
                      {payment.notes}
                    </AppText>
                  </View>
                )}
              </Card>
            ))}
          </View>
        ) : (
          <View className="bg-muted-light dark:bg-muted-dark rounded-2xl p-8 items-center justify-center border border-dashed border-border-light dark:border-border-dark">
            <CreditCard
              size={32}
              color={colors.mutedForeground}
              className="mb-2 opacity-50"
            />
            <AppText muted>مفيش دفعات مسجلة بعد</AppText>
          </View>
        )}
      </ScrollView>

      <AppDeleteModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="حذف المشتريات؟"
        description={`هل أنت متأكد إنك عايز تحذف "${purchaseDetails?.item_name}"؟ هيتحذف جميع البيانات المرتبطة بها.`}
      />
    </AppScreen>
  );
};

export default PurchaseDetailPage;
