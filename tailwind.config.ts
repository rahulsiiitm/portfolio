import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // DEFINING THE CUSTOM COLORS USED IN YOUR HERO
        "racing-red": "#E10600",       // Bright Red
        "carbon-black": "#111111",     // Deep Black
        "off-white": "#f4f4f4",        // The Studio Paper color
      },
      backgroundImage: {
        // DEFINING THE GRID PATTERN
        "grid-pattern": "linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-pattern": "40px 40px",
      }
    },
  },
  plugins: [],
};
export default config;