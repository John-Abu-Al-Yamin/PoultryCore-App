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
          dark: "#ffffff",
        },
        secondary: {
          light: "#F5F5F5",
          dark: "#474747",
        },
        background: {
          light: "#FFFFFF",
          dark: "#000000",
        },
        card: {
          light: "#FFFFFF",
          dark: "#111111",
        },
        text: {
          light: "#242424",
          dark: "#e2e2e2",
        },
        muted: {
          light: "#F5F5F5",
          dark: "#1e2020",
        },
        mutedForeground: {
          light: "#6B7280",
          dark: "#c4c7c8",
        },
        border: {
          light: "#EAEAEA",
          dark: "#444748",
        },
        success: {
          light: "#16a34a",
          dark: "#22c55e",
        },
        error: {
          light: "#9a3412",
          dark: "#ffb4ab",
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
