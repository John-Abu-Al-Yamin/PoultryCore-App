import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { View, Text } from "react-native";

const barn = () => {
  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="items-center justify-center px-4 flex-1"
    >
      <View>
        <AppText variant="body">العنبر</AppText>
      </View>
    </AppScreen>
  );
};

export default barn;
