/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        '102': '1.02',
      },
      fontFamily: {
        'quest': ['ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'quest-complete': 'questComplete 2s infinite',
        'badge-glow': 'badgeGlow 2s infinite',
      },
      keyframes: {
        questComplete: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        badgeGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.7' },
        },
      },
      colors: {
        parchment: {
          50: '#faf9f6',
          100: '#f5f4f1',
          200: '#eae8e3',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
