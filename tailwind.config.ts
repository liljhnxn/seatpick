import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#0b0c0e",
          900: "#111216",
          850: "#16181e",
          800: "#1c1e26",
          700: "#272a35",
          600: "#383c4a",
          500: "#52576b",
        },
        brand: {
          green: {
            DEFAULT: "#10b981",
            hover: "#059669",
            light: "#34d399",
            dim: "rgba(16, 185, 129, 0.15)",
            border: "rgba(16, 185, 129, 0.35)",
          },
          purple: {
            DEFAULT: "#8b5cf6",
            hover: "#7c3aed",
            light: "#a78bfa",
            dim: "rgba(139, 92, 246, 0.15)",
            border: "rgba(139, 92, 246, 0.35)",
          },
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;

