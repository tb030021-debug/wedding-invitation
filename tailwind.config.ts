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
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.125rem" }],
        sm: ["0.9375rem", { lineHeight: "1.375rem" }],
        base: ["1.0625rem", { lineHeight: "1.625rem" }],
        lg: ["1.1875rem", { lineHeight: "1.75rem" }],
        xl: ["1.375rem", { lineHeight: "2rem" }],
        "2xl": ["1.625rem", { lineHeight: "2.125rem" }],
        "3xl": ["2rem", { lineHeight: "2.4rem" }],
        "4xl": ["2.5rem", { lineHeight: "2.85rem" }],
        "5xl": ["3.25rem", { lineHeight: "1" }]
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
