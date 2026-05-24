import { lightColors } from "../constants/colors";

export type ThemeColors = typeof lightColors;

export type Theme = "light" | "dark";

export interface ThemeContextValue {
  colors: ThemeColors;
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}
