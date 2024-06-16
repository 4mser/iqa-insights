// tailwind.config.js

module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#121212',
        darkCard: '#1E1E1E',
        darkText: '#E0E0E0',
        lightBg: '#F9FAFB',
        lightCard: '#FFFFFF',
        lightText: '#333333',
        secondary: '#FFFFFF',
        primary: '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        '3xl': '0 10px 20px rgba(0, 0, 0, 0.15)',
        '4xl': '0 15px 30px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};
