/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          dark: "#1e40af",
          light: "#3b82f6"
        },
        secondary: {
          DEFAULT: "#475569",
          dark: "#334155",
          light: "#64748b"
        },
        accent: {
          DEFAULT: "#f59e0b",
          dark: "#d97706",
          light: "#fbbf24"
        },
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};