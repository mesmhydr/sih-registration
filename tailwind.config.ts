import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brutal: {
          bg: "#FAFAFA",
          text: "#0A0A0A",
          border: "#0A0A0A",
          shadow: "#0A0A0A",
          accentPurple: "#6B21A8",
          accentOrange: "#EA580C",
          accentGreen: "#15803D",
          accentBlue: "#1D4ED8",
          accentYellow: "#CA8A04",
          accentRed: "#B91C1C",
          error: "#B91C1C",
          success: "#15803D",
          warning: "#B45309",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "1.05", fontWeight: "800", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2rem, 5vw, 4rem)", { lineHeight: "1.1", fontWeight: "800", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.5rem, 4vw, 2.5rem)", { lineHeight: "1.15", fontWeight: "700", letterSpacing: "-0.01em" }],
        "heading-lg": ["clamp(1.25rem, 3vw, 1.75rem)", { lineHeight: "1.2", fontWeight: "700" }],
        "heading-md": ["clamp(1.125rem, 2.5vw, 1.375rem)", { lineHeight: "1.25", fontWeight: "700" }],
        "heading-sm": ["1rem", { lineHeight: "1.3", fontWeight: "700" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        "label": ["0.875rem", { lineHeight: "1.4", fontWeight: "600" }],
        "caption": ["0.75rem", { lineHeight: "1.4", fontWeight: "400" }],
      },
      borderWidth: {
        "brutal": "4px",
        "brutal-thick": "6px",
      },
      boxShadow: {
        "brutal": "6px 6px 0px #0A0A0A",
        "brutal-sm": "4px 4px 0px #0A0A0A",
        "brutal-lg": "8px 8px 0px #0A0A0A",
        "brutal-inset": "inset 4px 4px 0px #0A0A0A",
        "brutal-purple": "6px 6px 0px #6B21A8",
        "brutal-orange": "6px 6px 0px #EA580C",
        "brutal-green": "6px 6px 0px #15803D",
        "brutal-blue": "6px 6px 0px #1D4ED8",
        "brutal-yellow": "6px 6px 0px #CA8A04",
        "brutal-red": "6px 6px 0px #B91C1C",
      },
      borderRadius: {
        "brutal": "0",
        "brutal-sm": "2px",
      },
      transitionDuration: {
        "brutal": "100ms",
        "brutal-slow": "200ms",
      },
    },
  },
  plugins: [],
}
export default config