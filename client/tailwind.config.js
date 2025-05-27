/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: "class", // ✅ Enable dark mode with class
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0d9488", // teal-600
          dark: "#0f766e",    // teal-700
          light: "#5eead4",   // teal-300
        },
        secondary: {
          DEFAULT: "#06b6d4", // cyan-500
          dark: "#0891b2",    // cyan-600
          light: "#a5f3fc",   // cyan-200
        },
        accent: "#38bdf8",     // optional blue accent
      },
      gradientColorStops: theme => ({
        ...theme('colors'),
        medi: ['#0d9488', '#06b6d4'], // teal-600 to cyan-500
      }),
    },
  },
  plugins: [],plugins: [require('@tailwindcss/typography')],
}
