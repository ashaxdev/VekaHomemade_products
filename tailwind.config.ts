import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      colors: {
        cream: {
          50: "#FDFAF4",
          100: "#FAF4E8",
          200: "#F5E8D0",
          300: "#EDD4B0",
        },
        brown: {
          800: "#2C1A0E",
          700: "#3D2512",
          600: "#5C3D1E",
          500: "#7A5230",
          400: "#9B6B42",
        },
        maroon: {
          900: "#4A0010",
          800: "#6B001A",
          700: "#8B0024",
          600: "#A8002E",
          500: "#C20035",
        },
        gold: {
          500: "#C9933A",
          400: "#D9A84E",
          300: "#E8BC6A",
          200: "#F0D090",
        },
      },
      boxShadow: {
        card: "0 4px 20px rgba(44, 26, 14, 0.08)",
        "card-hover": "0 8px 40px rgba(44, 26, 14, 0.16)",
        gold: "0 4px 20px rgba(201, 147, 58, 0.25)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
