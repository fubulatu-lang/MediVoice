/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Material-3 Color System - Medical Green Theme
        primary: {
          DEFAULT: '#006A4E',
          50: '#E6F0EC',
          100: '#B3D8CB',
          200: '#80C0A9',
          300: '#4DA887',
          400: '#1A9066',
          500: '#006A4E',
          600: '#00553E',
          700: '#00402F',
          800: '#002A1F',
          900: '#001510',
        },
        secondary: {
          DEFAULT: '#4A6358',
          50: '#EDF1EF',
          100: '#CDD9D3',
          200: '#ADC1B7',
          300: '#8DA99B',
          400: '#6D917F',
          500: '#4A6358',
          600: '#3B4F46',
          700: '#2C3B35',
          800: '#1E2823',
          900: '#0F1412',
        },
        tertiary: {
          DEFAULT: '#3E6D8B',
          50: '#EAF0F5',
          100: '#C5D6E3',
          200: '#A0BCD1',
          300: '#7BA2BF',
          400: '#5688AD',
          500: '#3E6D8B',
          600: '#32576F',
          700: '#254153',
          800: '#192C38',
          900: '#0C161C',
        },
        error: {
          DEFAULT: '#BA1A1A',
          50: '#FFEDEA',
          100: '#FFDAD6',
          200: '#FFB4AB',
          300: '#FF897D',
          400: '#FF5449',
          500: '#BA1A1A',
          600: '#93000A',
          700: '#690005',
          800: '#410002',
          900: '#200001',
        },
        // Surface colors
        surface: {
          DEFAULT: '#F5FAF8',
          dark: '#1A1C1B',
          container: '#E8EDEA',
          'container-dark': '#2D312F',
        },
        // Neutrals
        outline: {
          DEFAULT: '#72796F',
          variant: '#C2C8BD',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Material-3 type scale
        'display-lg': ['3.562rem', { lineHeight: '4rem', fontWeight: '400' }],
        'display-md': ['2.812rem', { lineHeight: '3.25rem', fontWeight: '400' }],
        'display-sm': ['2.25rem', { lineHeight: '2.75rem', fontWeight: '400' }],
        'headline-lg': ['2rem', { lineHeight: '2.5rem', fontWeight: '400' }],
        'headline-md': ['1.75rem', { lineHeight: '2.25rem', fontWeight: '400' }],
        'headline-sm': ['1.5rem', { lineHeight: '2rem', fontWeight: '400' }],
        'title-lg': ['1.375rem', { lineHeight: '1.75rem', fontWeight: '700' }],
        'title-md': ['1rem', { lineHeight: '1.5rem', fontWeight: '700' }],
        'title-sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '700' }],
        'label-lg': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '600' }],
        'label-md': ['0.75rem', { lineHeight: '1rem', fontWeight: '600' }],
        'label-sm': ['0.6875rem', { lineHeight: '1rem', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'body-md': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'body-sm': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],
      },
      borderRadius: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.75rem',
        'full': '9999px',
      },
      boxShadow: {
        // Material-3 elevation
        'elevation-1': '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
        'elevation-2': '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
        'elevation-3': '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)',
        'elevation-4': '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.3)',
        'elevation-5': '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'pulse-recording': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
