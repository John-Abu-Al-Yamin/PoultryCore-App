import { Text } from "react-native";
import {
  Tajawal_400Regular,
  Tajawal_700Bold,
} from "@expo-google-fonts/tajawal";

export const fonts = {
  regular: Tajawal_400Regular,
  bold: Tajawal_700Bold,
};

export const setDefaultFont = () => {
  (Text as any).defaultProps = (Text as any).defaultProps || {};
  (Text as any).defaultProps.style = {
    fontFamily: "Tajawal",
  };
};