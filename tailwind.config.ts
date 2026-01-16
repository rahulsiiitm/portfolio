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
        'racing-red': '#E10600',
        'carbon-black': '#111111',
        'off-white': '#F4F4F4',
      },
    },
  },
  plugins: [],
};
export default config;