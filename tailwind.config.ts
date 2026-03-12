import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#e6fbff",
          100: "#b3f3ff",
          200: "#66e8ff",
          300: "#00d4f5",
          400: "#00c4e0",
          500: "#00b4cc",
          600: "#009ab0",
          700: "#007f91",
          800: "#006070",
          900: "#003d47",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
