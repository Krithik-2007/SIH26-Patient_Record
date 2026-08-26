/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#05070b',
        surface: {
          DEFAULT: '#090d16',
          elevated: '#0f1524',
          highlight: '#151e32',
          card: 'rgba(15, 21, 36, 0.75)',
          border: 'rgba(255, 255, 255, 0.07)',
          'border-active': 'rgba(6, 182, 212, 0.4)',
        },
        brand: {
          teal: '#0ea5e9',
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          violet: '#8b5cf6',
          slate: '#64748b'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'spatial-sm': '0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.04)',
        'spatial-md': '0 10px 30px -4px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'spatial-lg': '0 20px 45px -8px rgba(0, 0, 0, 0.8), 0 0 25px 1px rgba(6, 182, 212, 0.08)',
        'spatial-xl': '0 30px 60px -12px rgba(0, 0, 0, 0.9), 0 0 35px 2px rgba(6, 182, 212, 0.12)',
        'glow-teal': '0 0 25px -4px rgba(14, 165, 233, 0.35)',
        'glow-cyan': '0 0 25px -4px rgba(6, 182, 212, 0.35)',
        'glow-emerald': '0 0 25px -4px rgba(16, 185, 129, 0.35)',
        'glow-amber': '0 0 25px -4px rgba(245, 158, 11, 0.35)',
        'glow-rose': '0 0 25px -4px rgba(244, 63, 94, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'glow-breathe': 'breathe 5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
}
