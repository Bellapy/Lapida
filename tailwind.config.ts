import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-andika)', 'sans-serif'],
      },

      /* =========================
         BASE (OBRIGATÓRIO SHADCN)
         ========================= */
      colors: {
        border: '#707070',
        background: '#1E1E2A',
        foreground: '#FFFFFF',
        input: '#F0F0F0',
        ring: '#C4C4DD',

        /* =========================
           PALETA DO LÁPIDA (CUSTOM)
           ========================= */
        'os-dark': '#1E1E2A',
        'os-window-bg': '#E8E8F3',
        'os-primary': '#C4C4DD',
        'os-primary-hover': '#b0b0c9',
        'os-header': '#D9D9D9',
        'os-border': '#707070',
        'os-text': '#2D2D2D',
        'os-input-bg': '#F0F0F0',
      },

      borderRadius: {
        lg: '14px',
        md: '10px',
        sm: '6px',
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
