/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        sand: {
          50:'#FDFCF8', 100:'#F7F4EE', 200:'#EDE9DF', 300:'#DDD8CC',
          400:'#C4BDB0', 500:'#A89E91', 600:'#887D70', 700:'#655C50',
          800:'#433C33', 900:'#221F1A', 950:'#141210',
        },
        sage: {
          50:'#F2F7F0', 100:'#E1EDD9', 200:'#C3DBB4', 300:'#A0C48A',
          400:'#80AD64', 500:'#5F9147', 600:'#4A7337', 700:'#375629',
          800:'#253A1C', 900:'#141F0F', 950:'#0A110A',
        },
        mint: {
          50:'#F0F9F5', 100:'#D8F0E5', 200:'#B0E0CA', 300:'#7ECAAB',
          400:'#4CAF88', 500:'#2E8F6A', 600:'#237255', 700:'#1A5540',
          800:'#11382B', 900:'#081C15',
        },
        gold: { DEFAULT:'#C9912A', light:'#F0C96B', dark:'#8A6010' },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'shimmer': 'shimmer 2s infinite',
        'float':   'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:  { from:{opacity:'0',transform:'translateY(24px)'}, to:{opacity:'1',transform:'translateY(0)'} },
        fadeIn:  { from:{opacity:'0'}, to:{opacity:'1'} },
        shimmer: { '0%':{backgroundPosition:'-200% 0'}, '100%':{backgroundPosition:'200% 0'} },
        float:   { '0%,100%':{transform:'translateY(0px)'}, '50%':{transform:'translateY(-12px)'} },
      },
    },
  },
  plugins: [],
}
