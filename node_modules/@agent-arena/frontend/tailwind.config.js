/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arena: {
          bg: '#0a0a0f',
          card: '#12121a',
          border: '#2a2a3a',
          primary: '#00f5ff',
          secondary: '#ff00aa',
          accent: '#7b2cbf',
          success: '#00ff9d',
          warning: '#ffaa00',
          danger: '#ff4d4d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}