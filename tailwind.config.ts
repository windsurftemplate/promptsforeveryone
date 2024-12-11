import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F172A',
          light: '#1E293B',
          dark: '#020617',
          accent: '#3B82F6'
        },
        surface: {
          DEFAULT: '#1E293B',
          light: '#334155',
          dark: '#0F172A'
        },
        text: {
          DEFAULT: '#F8FAFC',
          muted: '#94A3B8',
          accent: '#60A5FA'
        }
      },
      fontFamily: {
        mono: ['var(--font-jetbrains)', 'monospace'],
        sans: ['var(--font-inter)', 'system-ui']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
