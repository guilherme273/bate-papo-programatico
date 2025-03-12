/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "480px", // Novo breakpoint 'xs' (extra small)
        sm: "640px", // Breakpoint pequeno
        md: "768px", // Breakpoint médio
        lg: "1024px", // Breakpoint grande
        xl: "1280px", // Breakpoint extra grande
        sl: "1536px", // Breakpoint para telas ultra grandes
      },
    },
  },
  plugins: [],
};
