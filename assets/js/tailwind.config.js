/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./assets/js/*.js"],
  theme: {
    extend: {
      colors: {
        neutralDark: '#111827',
        neutralMuted: '#4B5563',
        neutralLight: '#F8F6F0',
        accentColor: '#2563EB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}