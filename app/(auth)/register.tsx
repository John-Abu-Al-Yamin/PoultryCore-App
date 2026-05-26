import AppButton from "@/src/components/custom/AppButton";
import AppInput from "@/src/components/custom/AppInput";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Link, router } from "expo-router";
import { Eye, EyeOff, Lock, Phone, User } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { registerSchema } from "@/src/validationSchema/auth/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

import useRegister from "@/src/hooks/Actions/auth/useRegister";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showpassword_confirmation, setShowpassword_confirmation] =
    useState(false);

  const { mutate, isPending } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    mutate(
      { data },
      {
        onSuccess: () => {
          console.log(" Registration successful:", data);
          router.replace("/(setup)/barn");
        },
        onError: (error) => {
          console.log("Registration failed:", error);
        },
      },
    );
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
            <User size={24} color={colors.text} />
          </View>
          <AppText variant="h1" className="text-center">
            إنشاء حساب جديد
          </AppText>
          <AppText variant="body" muted className="text-center mt-1">
            أدخل بياناتك للتسجيل
          </AppText>
        </View>

        {/* ===== Name ===== */}
        <View className="mb-5">
          <AppText variant="label" className="mb-2">
            الاسم
          </AppText>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                rightIcon={<User size={18} color={colors.mutedForeground} />}
                placeholder="أدخل اسمك"
                error={errors.name?.message}
                textAlign="right"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        {/* ===== Phone ===== */}
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

        {/* ===== Confirm Password ===== */}
        <View className="mb-4">
          <AppText variant="label" className="mb-2">
            تأكيد كلمة المرور
          </AppText>
          <Controller
            control={control}
            name="password_confirmation"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                leftIcon={<Lock size={18} color={colors.mutedForeground} />}
                rightIcon={
                  <Pressable
                    onPress={() =>
                      setShowpassword_confirmation(!showpassword_confirmation)
                    }
                  >
                    {showpassword_confirmation ? (
                      <EyeOff size={18} color={colors.mutedForeground} />
                    ) : (
                      <Eye size={18} color={colors.mutedForeground} />
                    )}
                  </Pressable>
                }
                placeholder="أعد إدخال كلمة المرور"
                secureTextEntry={!showpassword_confirmation}
                error={errors.password_confirmation?.message}
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
          إنشاء حساب
        </AppButton>

        {/* ===== Navigate to Login ===== */}
        <View className="flex-row justify-center items-center mt-6">
          <AppText variant="bodySmall" muted>
            لديك حساب بالفعل؟
          </AppText>
          <Link href="/login" asChild>
            <Pressable>
              <AppText
                variant="bodySmall"
                className="text-primary-light dark:text-primary-dark me-1"
              >
                {" "}
                تسجيل الدخول
              </AppText>
            </Pressable>
          </Link>
        </View>
      </View>
    </AppScreen>
  );
}
