import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bone: "#F6F5F2",
        field: "#8F8E7F",
        sprout: "#8FB135",
        grove: "#487531",
        canopy: "#1D3215"
      },
      boxShadow: {
        brutal: "6px 6px 0 #1D3215",
        "brutal-sm": "3px 3px 0 #1D3215"
      },
      fontFamily: {
        sans: ["var(--font-body)", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Arial Black", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
