/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        tajawal: ["Tajawal"],
        "tajawal-bold": ["Tajawal"],
      },
      colors: {
        primary: {
          light: "#111111",
          dark: "#EAEAEA",
        },
        secondary: {
          light: "#F5F5F5",
          dark: "#3F3F3F",
        },
        background: {
          light: "#FFFFFF",
          dark: "#0C0C0C",
        },
        card: {
          light: "#FFFFFF",
          dark: "#111111",
        },
        text: {
          light: "#242424",
          dark: "#FAFAFA",
        },
        muted: {
          light: "#F5F5F5",
          dark: "#3F3F3F",
        },
        mutedForeground: {
          light: "#6B7280",
          dark: "#9CA3AF",
        },
        border: {
          light: "#EAEAEA",
          dark: "#FFFFFF1A",
        },
        success: {
          light: "#16a34a",
          dark: "#22c55e",
        },
        error: {
          light: "#9a3412",
          dark: "#f87171",
        },
        warning: {
          light: "#eab308",
          dark: "#fbbf24",
        },
      },
    },
  },
  plugins: [],
};
