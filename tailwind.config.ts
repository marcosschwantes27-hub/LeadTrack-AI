import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          0: 'var(--surface-0)',
          1: 'var(--surface-1)',
          2: 'var(--surface-2)',
          3: 'var(--surface-3)',
          4: 'var(--surface-4)',
        },
        line: {
          DEFAULT: 'var(--line)',
          hover: 'var(--line-hover)',
          active: 'var(--line-active)',
        },
        content: {
          1: 'var(--content-1)',
          2: 'var(--content-2)',
          3: 'var(--content-3)',
        },
        accent: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          muted: '#3b82f614',
          glow: '#3b82f620',
        },
        cyan: {
          DEFAULT: '#06b6d4',
          muted: '#06b6d414',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'robot-walk': 'robotWalk 8s cubic-bezier(0.45,0.05,0.55,0.95) infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
        'pulse-dot': 'pulseDot 1.8s ease-in-out infinite',
        'step-complete': 'stepComplete 0.4s ease-out forwards',
      },
      keyframes: {
        robotWalk: {
          '0%, 100%': { transform: 'translateX(-50px)' },
          '50%': { transform: 'translateX(50px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.3)' },
        },
        stepComplete: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
