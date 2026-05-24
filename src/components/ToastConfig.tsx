import { View, Text, ActivityIndicator, StyleSheet, I18nManager } from "react-native";
import { Check, AlertCircle, X } from "lucide-react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import type { BaseToastProps } from "react-native-toast-message";

const rtl = I18nManager.isRTL;

function SuccessToast({ text1 }: BaseToastProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.accent, rtl ? styles.accentRight : styles.accentLeft, { backgroundColor: colors.success }]} />
      <View style={styles.iconWrap}>
        <View style={[styles.iconCircle, { backgroundColor: `${colors.success}20` }]}>
          <Check size={18} color={colors.success} strokeWidth={3} />
        </View>
      </View>
      <Text style={[styles.text, { color: colors.text, fontFamily: "Tajawal" }]}>{text1}</Text>
    </View>
  );
}

function ErrorToast({ text1 }: BaseToastProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.accent, rtl ? styles.accentRight : styles.accentLeft, { backgroundColor: colors.error }]} />
      <View style={styles.iconWrap}>
        <View style={[styles.iconCircle, { backgroundColor: `${colors.error}20` }]}>
          <X size={18} color={colors.error} strokeWidth={3} />
        </View>
      </View>
      <Text style={[styles.text, { color: colors.text, fontFamily: "Tajawal" }]}>{text1}</Text>
    </View>
  );
}

function LoadingToast({ text1 }: BaseToastProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.accent, rtl ? styles.accentRight : styles.accentLeft, { backgroundColor: colors.muted }]} />
      <View style={styles.iconWrap}>
        <ActivityIndicator size={20} color={colors.primary} />
      </View>
      <Text style={[styles.text, { color: colors.text, fontFamily: "Tajawal" }]}>{text1}</Text>
    </View>
  );
}

export const toastConfig = {
  success: SuccessToast,
  error: ErrorToast,
  loading: LoadingToast,
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    width: "92%",
    minHeight: 56,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  accentLeft: {
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  accentRight: {
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },
  accent: {
    width: 4,
    alignSelf: "stretch",
  },
  iconWrap: {
    paddingHorizontal: 14,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    paddingVertical: 16,
    paddingRight: 14,
    writingDirection: rtl ? "rtl" : "ltr",
  },
});
