/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#040508',
          900: '#090A0F',
          850: '#0E1017',
          800: '#13151F',
          700: '#1C1F2E',
        },
        graphite: {
          DEFAULT: '#13151F',
          light: '#1F2333',
          border: '#2A2F45',
        },
        gold: {
          300: '#F3E5AB',
          400: '#E5C158',
          500: '#D4AF37', // Champagne Gold
          600: '#B89726',
          700: '#8C7015',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669', // Deep Emerald
          900: '#064E3B',
          950: '#022C22',
        },
        crimson: {
          500: '#F43F5E',
          600: '#E11D48', // Controlled Crimson
          900: '#881337',
        },
        platinum: {
          DEFAULT: '#E2E8F0',
          muted: '#94A3B8',
          subtle: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'glass-radial': 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.08) 0%, rgba(9, 10, 15, 0) 70%)',
        'emerald-radial': 'radial-gradient(circle at 50% 0%, rgba(5, 150, 105, 0.12) 0%, rgba(9, 10, 15, 0) 70%)',
      },
      keyframes: {
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'scanline': 'scanline 8s linear infinite',
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
