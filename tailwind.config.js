module.exports = {
  darkMode: 'class', // Use 'media' for automatic, 'class' for manual toggle
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4ade80', // green-400
          DEFAULT: '#22c55e', // green-600
          dark: '#166534', // green-800
        },
        card: {
          light: '#fff',
          DEFAULT: '#23272f',
          dark: '#18181b',
        },
        accent: {
          yellow: '#fde047',
          red: '#ef4444',
        },
      },
      boxShadow: {
        'glow': '0 0 40px 10px #fde047',
      },
    },
  },
  plugins: [],
}; 