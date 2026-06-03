import { View } from "react-native";
import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { useLocalSearchParams } from "expo-router";

export default function EditBarnPage() {
  const { id } = useLocalSearchParams();

  return (
    <AppScreen 
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="px-4 pt-4 pb-8"
    >
      <View className="mb-6">
        <AppText variant="h1">تعديل عنبر {id}</AppText>
      </View>
      {/* Form components will go here */}
    </AppScreen>
  );
}
