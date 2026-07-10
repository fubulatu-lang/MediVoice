/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
        emerald: {
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
        error: {
          DEFAULT: '#DC2626',
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#DC2626',
          600: '#B91C1C',
        },
      },
      boxShadow: {
        'elevation-1': '0px 1px 2px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)',
        'elevation-2': '0px 1px 2px rgba(0, 0, 0, 0.1), 0px 2px 6px rgba(0, 0, 0, 0.08)',
        'elevation-3': '0px 4px 8px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)',
        'elevation-4': '0px 6px 10px rgba(0, 0, 0, 0.1), 0px 2px 3px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
