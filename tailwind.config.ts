import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040912',
          900: '#07111f',
          800: '#0b1828',
          700: '#0f1f33',
        },
        ivory: {
          DEFAULT: '#f5efe6',
          50: '#fbf8f3',
          100: '#f5efe6',
          200: '#e8e0d0',
        },
        gold: {
          DEFAULT: '#c8a86a',
          50: '#f5ecd5',
          100: '#e8d4a5',
          200: '#d4b97e',
          300: '#c8a86a',
          400: '#b8935a',
          500: '#9c7c4a',
        },
        muted: '#8b9bb0',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
      },
      letterSpacing: {
        'extra-wide': '0.25em',
        'mega-wide': '0.4em',
      },
      animation: {
        'float-slow': 'float 12s ease-in-out infinite',
        'fade-up': 'fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
