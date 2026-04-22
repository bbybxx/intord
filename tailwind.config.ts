import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#f7f3ee",
          100: "#efe7dd",
          200: "#dfd0bc",
          400: "#c8ab86",
          600: "#a37a4a",
          800: "#5e4228"
        },
        ink: "#14120f"
      },
      fontFamily: {
        heading: ["'Playfair Display'", "serif"],
        body: ["'Manrope'", "sans-serif"]
      },
      boxShadow: {
        card: "0 12px 30px rgba(20,18,15,0.08)"
      }
    }
  },
  plugins: []
};

export default config;
