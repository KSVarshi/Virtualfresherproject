/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6edf5',
          100: '#ccdaeb',
          200: '#99b5d7',
          300: '#6690c3',
          400: '#336baf',
          500: '#00469b',
          600: '#0A2647', // Primary
          700: '#081d35',
          800: '#051324',
          900: '#030a12',
        },
        secondary: {
          50: '#e7f9f7',
          100: '#cff3ef',
          200: '#9fe7df',
          300: '#6fdccf',
          400: '#3fd0bf',
          500: '#14B8A6', // Secondary
          600: '#10a594',
          700: '#0c7d70',
          800: '#08544b',
          900: '#042a25',
        },
        accent: {
          50: '#fff0f0',
          100: '#ffe1e1',
          200: '#ffc4c4',
          300: '#ffa6a6',
          400: '#ff8989',
          500: '#FF6B6B', // Accent
          600: '#ff3d3d',
          700: '#ff0f0f',
          800: '#e00000',
          900: '#b20000',
        },
        success: {
          500: '#10b981',
        },
        warning: {
          500: '#f59e0b',
        },
        error: {
          500: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}