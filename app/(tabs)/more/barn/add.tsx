import { View } from "react-native";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";

export default function AddBarnPage() {
  return (
    <AppScreen 
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="px-4 pt-4 pb-8"
    >
      <View className="mb-6">
        <AppText variant="h1">إضافة عنبر</AppText>
      </View>
      {/* Form components will go here */}
    </AppScreen>
  );
}
