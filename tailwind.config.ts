import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090B", // Zinc-950 (Very Dark Matte)
        card: "#18181B",       // Zinc-900 (Surface)
        border: "#27272A",     // Zinc-800 (Subtle Border)
        primary: "#D9F154",    // Solid Lime (Modern Fintech Color)
      },
    },
  },
  plugins: [],
};
export default config;
