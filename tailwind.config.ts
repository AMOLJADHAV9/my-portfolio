import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Glassmorphism palette
        glass: "rgba(255,255,255,0.15)",
        "glass-dark": "rgba(24,24,27,0.6)",
        "glass-strong": "rgba(255,255,255,0.4)",
        accent: "#38bdf8",
        "accent-dark": "#0ea5e9",
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        sans: ["'Geist Sans'", "Inter", "ui-sans-serif", "system-ui"],
        mono: ["'Geist Mono'", "ui-monospace", "SFMono-Regular"],
      },
      boxShadow: {
        glass: "0 4px 32px 0 rgba(31, 38, 135, 0.37)",
      },
    },
  },
  plugins: [],
};
export default config;