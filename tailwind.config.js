/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // 75 Hard red/black theme
        accent: {
          DEFAULT: '#E63946',
          dark: '#C1121F',
        },
        dark: {
          DEFAULT: '#000000',
          100: '#0a0a0a',
          200: '#121212',
          300: '#1a1a1a',
          400: '#242424',
        },
        gray: {
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
        },
      },
    },
  },
  plugins: [],
};
