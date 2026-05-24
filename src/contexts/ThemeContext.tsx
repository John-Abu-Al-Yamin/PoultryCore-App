import { createContext, useContext, type ReactNode } from "react";
import { useColorScheme } from "nativewind";
import { lightColors, darkColors } from "../constants/colors";
import type { Theme, ThemeColors, ThemeContextValue } from "@/src/types";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { colorScheme, toggleColorScheme, setColorScheme } = useColorScheme();
  const theme: Theme = colorScheme ?? "light";
  const colors = theme === "dark" ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        colors,
        theme,
        toggleTheme: toggleColorScheme,
        setTheme: setColorScheme as (theme: Theme) => void,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
