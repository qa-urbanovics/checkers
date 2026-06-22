/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#08080F',
          card: '#13131F',
          cardHover: '#1A1A2E',
          border: '#252540',
          borderLight: '#353560',
        },
        gold: {
          DEFAULT: '#D4A84B',
          light: '#F0CC7A',
          dark: '#A07830',
          glow: 'rgba(212,168,75,0.35)',
        },
        piece: {
          redBright: '#FF5252',
          red: '#C62828',
          redDark: '#7B0000',
          silverLight: '#90A4AE',
          silver: '#546E7A',
          silverDark: '#1C2B33',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        'gold-glow': '0 0 24px rgba(212,168,75,0.4)',
        'piece-red': '0 4px 16px rgba(198,40,40,0.6), inset 0 2px 4px rgba(255,150,150,0.3)',
        'piece-silver': '0 4px 16px rgba(30,50,60,0.7), inset 0 2px 4px rgba(200,220,230,0.2)',
        'piece-selected': '0 0 0 3px #4A9EFF, 0 0 20px rgba(74,158,255,0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-gold': 'pulseGold 1.5s ease-in-out infinite',
        'crown-pop': 'crownPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { transform: 'translateY(20px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
        pulseGold: {
          '0%,100%': { boxShadow: '0 0 0 3px rgba(212,168,75,0.6)' },
          '50%': { boxShadow: '0 0 0 5px rgba(212,168,75,0.9), 0 0 20px rgba(212,168,75,0.4)' },
        },
        crownPop: {
          '0%': { transform: 'scale(0) rotate(-90deg)', opacity: 0 },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
