/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#121214',
        'brand-purple': '#646cff',
        'brand-accent': '#747bff',
        'dark-surface': '#1a1a1e',
      },
    },
  },
  plugins: [],
}