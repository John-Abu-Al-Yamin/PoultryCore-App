import AppScreen from "@/src/components/custom/AppScreen";
import AppText from "@/src/components/custom/AppText";
import { View } from "react-native";

const purchases = () => {
  return (
    <AppScreen
      className="bg-background-light dark:bg-background-dark"
      contentContainerClassName="items-center justify-center px-4 flex-1"
    >
      <View>
        <AppText variant="body">المشتريات</AppText>
      </View>
    </AppScreen>
  );
};

export default purchases;
