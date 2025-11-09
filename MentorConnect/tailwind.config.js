/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef7ff',
          100: '#d9ecff',
          200: '#bfe0ff',
          300: '#93cbff',
          400: '#5cafff',
          500: '#2b92ff',
          600: '#1672e6',
          700: '#1159b9',
          800: '#114a95',
          900: '#123e79'
        },
        tealish: {
          500: '#2ec4b6'
        }
      },
      boxShadow: {
        soft: '0 8px 20px rgba(0,0,0,0.06)'
      }
    },
  },
  plugins: [],
}
