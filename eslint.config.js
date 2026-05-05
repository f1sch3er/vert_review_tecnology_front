/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores baseadas no estilo da imagem e do Vite
        'dark-bg': '#121214',
        'dark-card': '#1a1a1e',
        'brand-purple': '#646cff', // Roxo do Vite
        'brand-accent': '#747bff',
      },
    },
  },
  plugins: [],
}