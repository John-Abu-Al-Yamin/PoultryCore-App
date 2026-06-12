import { useEffect, useRef, useState } from "react";
import { Linking, ScrollView, View, Animated, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import {
  HelpCircle,
  LogOut,
  Mail,
  Moon,
  Phone,
  Sun,
  User,
  AlertTriangle,
  MessageCircle,
} from "lucide-react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import AppDeleteModal from "@/src/components/custom/AppDeleteModal";
import SettingsSection from "@/src/components/settings/SettingsSection";
import SettingsRow from "@/src/components/settings/SettingsRow";
import { getUser, removeAuthToken, removeUser } from "@/src/services/cookies";
import type { User as UserType } from "@/src/types";

const TOGGLE_WIDTH = 48;
const TOGGLE_HEIGHT = 26;
const THUMB_SIZE = 22;
const THUMB_PADDING = 2;

function ThemeToggle({
  value,
  onToggle,
  colors,
}: {
  value: boolean;
  onToggle: () => void;
  colors: any;
}) {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.mutedForeground, colors.primary],
  });

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const thumbLeft = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      THUMB_PADDING,
      TOGGLE_WIDTH - THUMB_SIZE - THUMB_PADDING,
    ],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onToggle}
    >
      <Animated.View
        style={{
          width: TOGGLE_WIDTH,
          height: TOGGLE_HEIGHT,
          borderRadius: TOGGLE_HEIGHT / 2,
          backgroundColor: trackColor,
          padding: 0,
        }}
      >
        <Animated.View
          style={{
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: THUMB_SIZE / 2,
            backgroundColor: colors.background,
            position: "absolute",
            top: (TOGGLE_HEIGHT - THUMB_SIZE) / 2,
            left: thumbLeft,
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function SettingsPage() {
  const { colors, theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<UserType | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    await removeAuthToken();
    await removeUser();
    router.replace("/(auth)/login");
  };

  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="px-4 pt-4 pb-12"
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-8 items-center">
          <View className="w-24 h-24 rounded-full bg-muted-light dark:bg-muted-dark items-center justify-center border-4 border-white dark:border-card-dark shadow-sm">
            <User size={48} color={colors.primary} />
          </View>
          <AppText variant="h2" className="mt-4">
            إعدادات الحساب
          </AppText>
          <AppText variant="caption" muted>
            إدارة تفضيلاتك ومعلوماتك
          </AppText>
        </View>

        {/* Personal Information */}
        <SettingsSection title="معلومات شخصية">
          <SettingsRow
            icon={<User size={20} color={theme === "dark" ? "#FFFFFF" : "#000000"} />}
            label="الاسم"
            description={user?.name || "---"}
          />
          
          <View className="h-[1px] bg-border-light dark:bg-border-dark mx-4" />
          <SettingsRow
            icon={<Phone size={20} color={theme === "dark" ? "#FFFFFF" : "#000000"} />}
            label="رقم الهاتف"
            description={user?.phone || "---"}
          />
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection title="المظهر">
          <SettingsRow
            icon={theme === "dark" ? <Moon size={20} color="#FFFFFF" /> : <Sun size={20} color="#000000" />}
            label="الوضع الليلي"
            description={theme === "dark" ? "شغال" : "موقف"}
            rightAction={<ThemeToggle value={theme === "dark"} onToggle={toggleTheme} colors={colors} />}
          />
        </SettingsSection>

        {/* Support */}
        <SettingsSection title="الدعم">
          <SettingsRow
            icon={<MessageCircle size={20} color={theme === "dark" ? "#FFFFFF" : "#000000"} />}
            label="تواصل معنا"
            description="راسلنا لأي استفسار"
            onPress={() => Linking.openURL("https://wa.me/201286976691")}
          />
          <SettingsRow
            icon={<AlertTriangle size={20} color={theme === "dark" ? "#FFFFFF" : "#000000"} />}
            label="الإبلاغ عن مشكلة"
            description="أبلغنا عن أي مشكلة تواجهها"
            onPress={() => Linking.openURL("https://wa.me/201286976691")}
          />
          <SettingsRow
            icon={<HelpCircle size={20} color={theme === "dark" ? "#FFFFFF" : "#000000"} />}
            label="الأسئلة الشائعة"
            description="أجوبة لأكثر الأسئلة شيوعاً"
            onPress={() => router.push("/more/settings/faq")}
          />
        </SettingsSection>

        {/* Logout */}
        <View className="mt-2">
          <SettingsSection>
            <SettingsRow
              icon={<LogOut size={20} color="#ef4444" />}
              label="تسجيل الخروج"
              destructive
              onPress={handleLogout}
            />
          </SettingsSection>
        </View>

        <View className="items-center mt-4">
          <AppText variant="caption" muted>
            الإصدار 1.0.0
          </AppText>
        </View>
      </ScrollView>

      <AppDeleteModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="تسجيل الخروج"
        description="هل أنت متأكد إنك عايز تسجيل الخروج؟"
        confirmText="تسجيل الخروج"
        cancelText="إلغاء"
      />
    </AppScreen>
  );
}
