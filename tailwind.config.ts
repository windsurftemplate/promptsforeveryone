import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          DEFAULT: '#0A8F6A',
          light: '#0FB97F',
          dark: '#067A58',
          50: '#E6F7F2',
          100: '#C2EBE0',
          200: '#8FD9C5',
          300: '#5CC7AA',
          400: '#29B58F',
          500: '#0A8F6A',
          600: '#087A5B',
          700: '#06654C',
          800: '#04503D',
          900: '#023B2E',
        },
        surface: {
          DEFAULT: 'rgba(0, 0, 0, 0.8)',
          light: 'rgba(255, 255, 255, 0.05)',
          dark: '#050505',
        },
        neutral: {
          850: '#1a1a1a',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'gradient': 'animate-gradient 8s ease infinite',
        'soft-fade': 'softFade 0.5s ease forwards',
        'rotate-gradient': 'rotate-gradient 4s linear infinite',
        'border-beam': 'borderBeamRotation 4s linear infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '0.2',
            boxShadow: '0 0 20px rgba(10, 143, 106, 0.2)',
          },
          '50%': {
            opacity: '0.4',
            boxShadow: '0 0 40px rgba(10, 143, 106, 0.4)',
          },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'animate-gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        softFade: {
          from: { opacity: '0', transform: 'translateY(8px)', filter: 'blur(4px)' },
          to: { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        'rotate-gradient': {
          to: { transform: 'rotate(360deg)' },
        },
        borderBeamRotation: {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-emerald': 'linear-gradient(180deg, rgba(10, 143, 106, 0.1) 0%, transparent 100%)',
        'ambient': 'radial-gradient(circle at 15% 50%, rgba(10, 143, 106, 0.08), transparent 25%), radial-gradient(circle at 85% 30%, rgba(255, 255, 255, 0.03), transparent 25%)',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(10, 143, 106, 0.2)',
        'glow': '0 0 20px rgba(10, 143, 106, 0.3)',
        'glow-lg': '0 0 40px rgba(10, 143, 106, 0.4)',
        'glow-xl': '0 0 60px rgba(10, 143, 106, 0.5)',
        'inner-glow': 'inset 0 0 20px rgba(10, 143, 106, 0.1)',
        'glass': '0 4px 24px -1px rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'glass-hover': '0 8px 32px -4px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

export default config
