/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#121212", 
          dark: "#1E1E1E",
          light: "#F5F5F7",
          accent: "#D4AF37", 
          silver: "#C0C0C0",
        },
      },
    },
  },
  plugins: [],
};