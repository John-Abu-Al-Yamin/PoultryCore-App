import { View, Text } from "react-native";
import React from "react";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";

const EditPaymentPage = () => {
  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="px-4 pt-4 pb-8"
    >
      <View className="mb-6">
        <AppText variant="h1">تعديل الدفعة</AppText>
        <AppText variant="body" muted className="mt-1">
          قم بتعديل تفاصيل الدفعة
        </AppText>
      </View>
    </AppScreen>
  );
};

export default EditPaymentPage;
