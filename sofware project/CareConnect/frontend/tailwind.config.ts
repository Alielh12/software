import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1F7A8C",
          foreground: "#FFFFFF"
        },
        accent: "#F2A541"
      }
    }
  },
  plugins: []
};

export default config;
