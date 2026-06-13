import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import AppText from "./AppText";

interface AppPaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  from: number | null;
  to: number | null;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export default function AppPagination({
  currentPage,
  lastPage,
  total,
  from,
  to,
  isLoading,
  onPageChange,
}: AppPaginationProps) {
  const { colors } = useTheme();

  if (lastPage <= 1 && total <= 20) return null;

  const btnClass =
    "px-4 py-2 rounded-xl flex-row items-center gap-1.5 border border-border-light dark:border-border-dark";
  const disabledBtnClass = "opacity-40";

  return (
    <View className="mt-4 gap-3">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          className={`${btnClass} ${currentPage <= 1 ? disabledBtnClass : ""}`}
          disabled={currentPage <= 1 || isLoading}
          activeOpacity={0.8}
          onPress={() => onPageChange(currentPage - 1)}
        >
          <ChevronRight size={16} color={colors.text} />
          <AppText variant="bodySmall" className="font-semibold">
            السابق
          </AppText>
        </TouchableOpacity>

        <View className="flex-row items-center gap-2">
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <AppText variant="bodySmall" muted>
              {currentPage} من {lastPage}
            </AppText>
          )}
        </View>

        <TouchableOpacity
          className={`${btnClass} ${currentPage >= lastPage ? disabledBtnClass : ""}`}
          disabled={currentPage >= lastPage || isLoading}
          activeOpacity={0.8}
          onPress={() => onPageChange(currentPage + 1)}
        >
          <AppText variant="bodySmall" className="font-semibold">
            التالي
          </AppText>
          <ChevronLeft size={16} color={colors.text} />
        </TouchableOpacity>
      </View>

      {from != null && to != null && total > 0 && (
        <AppText variant="caption" muted className="text-center">
          عرض {from}–{to} من {total} عنصرًا
        </AppText>
      )}
    </View>
  );
}
