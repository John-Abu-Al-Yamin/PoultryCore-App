import { View, Text } from "react-native";
import React from "react";
import AppText from "@/src/components/custom/AppText";
import AppScreen from "@/src/components/custom/AppScreen";

const AddPaymentPage = () => {
  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="px-4 pt-4 pb-8"
    >
      <View className="mb-6">
        <AppText variant="h1">إضافة دفعة جديدة</AppText>
        <AppText variant="body" muted className="mt-1">
          سجل دفعة جديدة لمورد أو تحصيل من عميل
        </AppText>
      </View>
    </AppScreen>
  );
};

export default AddPaymentPage;
