// src/config/rtl.ts
import { I18nManager } from "react-native";

export const enableRTL = () => {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
};