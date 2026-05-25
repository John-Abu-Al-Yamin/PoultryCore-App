import AppButton from "@/src/components/custom/AppButton";
import AppInput from "@/src/components/custom/AppInput";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Eye, EyeOff, Lock, Phone } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Link } from "expo-router";

import useLogin from "@/src/hooks/Actions/auth/useLogin";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/src/validationSchema/auth/login";
import type { z } from "zod";

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending, isError, errorMsg, setErrorMsg } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(
      { data: data },
      {
        onSuccess: () => {
          console.log("Login successful, navigating to home...");
        },
        onError: (error) => {
          console.log("Login failed:", error);
        },
        
      },
    );
    console.log("Login data:", data);
  };

  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="items-center px-4 pt-20 justify-start"
    >
      <View className="w-full max-w-md bg-card-light dark:bg-background-dark rounded-2xl p-6">
        {/* ===== Header ===== */}
        <View className="items-center mb-8">
          <View className="w-12 h-12 bg-secondary-light dark:bg-secondary-dark border border-border-light dark:border-border-dark rounded-xl items-center justify-center mb-4">
            <Lock size={24} color={colors.text} />
          </View>
          <AppText variant="h1" className="text-center">
            مرحباً بعودتك
          </AppText>
          <AppText variant="body" muted className="text-center mt-1">
            أدخل بيانات الدخول الخاصة بك
          </AppText>
        </View>

        {/* ===== Phone Number ===== */}
        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            رقم الموبيل
          </AppText>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                keyboardType="phone-pad"
                rightIcon={<Phone size={18} color={colors.mutedForeground} />}
                placeholder="أدخل رقم الموبيل"
                error={errors.phone?.message}
                textAlign="right"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        {/* ===== Password ===== */}
        <View className="mb-4">
          <AppText variant="label" className="mb-2">
            كلمة المرور
          </AppText>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                leftIcon={<Lock size={18} color={colors.mutedForeground} />}
                rightIcon={
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff size={18} color={colors.mutedForeground} />
                    ) : (
                      <Eye size={18} color={colors.mutedForeground} />
                    )}
                  </Pressable>
                }
                placeholder="أدخل كلمة المرور"
                secureTextEntry={!showPassword}
                error={errors.password?.message}
                textAlign="right"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        {/* ===== Submit ===== */}
        <AppButton loading={isPending} onPress={handleSubmit(onSubmit)}>
          تسجيل الدخول
        </AppButton>

        {/* ===== Navigate to Register ===== */}
        <View className="flex-row justify-center items-center mt-6">
          <AppText variant="bodySmall" muted>
            ليس لديك حساب؟
          </AppText>
          <Link href="/register" asChild>
            <Pressable>
              <AppText
                variant="bodySmall"
                className="text-primary-light dark:text-primary-dark me-1"
              >
                سجل الآن
              </AppText>
            </Pressable>
          </Link>
        </View>
      </View>
    </AppScreen>
  );
}
