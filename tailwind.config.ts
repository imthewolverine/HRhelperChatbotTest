import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#eef2f9",
        panel: "#ffffff",
        panelMuted: "#f6f7fb",
        accent: "#2563eb",
        accentSoft: "#e0ebff",
        border: "#e5e7eb",
        textPrimary: "#0f172a",
        textSecondary: "#475569",
        success: "#10b981",
        warning: "#f59e0b"
      }
    }
  },
  plugins: []
};

export default config;
