import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        foundation: "#0E332A",
        moss: "#1E5C4C",
        build: "#F17B22",
        concrete: "#EEF1EF",
        graphite: "#1E2523"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(14, 51, 42, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
