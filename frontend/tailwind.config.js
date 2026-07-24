/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0EA5E9', // Trust Sky Blue
          dark: '#0284C7',
        },
        secondary: '#10B981', // Emerald Green
        dark: '#1E293B',      // Slate Text Color
        lightBg: '#F8FAFC',   // Light gray background
        emergency: '#EF4444', // Red for emergency modules
      },
    },
  },
  plugins: [],
}