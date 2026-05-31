import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#fffaf0",
        champagne: "#f5ead8",
        rose: "#d99aa5",
        petal: "#f7d8dc",
        gold: "#b8955b",
        ink: "#4f4540",
        moss: "#879174"
      },
      boxShadow: {
        soft: "0 16px 48px rgba(95, 70, 54, 0.10)"
      },
      fontFamily: {
        sans: [
          "var(--font-wedding-body)",
          "var(--font-wedding-fallback)",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "system-ui",
          "sans-serif"
        ],
        serif: [
          "var(--font-wedding-body)",
          "var(--font-wedding-fallback)",
          "AppleMyungjo",
          "Batang",
          "serif"
        ]
      }
    }
  },
  plugins: []
};

export default config;
