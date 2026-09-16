/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        navy: {
          800: '#000B75', // Dark Royal Blue
          900: '#04044A', // Navy
          950: '#020225', // Darkest Navy
        },
        panel: {
          50:  '#EBF2FF',
          100: '#D6E4FF',
          200: '#ADC7FF',
          300: '#80A7FF',
          400: '#5285FF',
          500: '#2463FF', // Panel Blue
          600: '#0043F0',
          700: '#0032C9',
          800: '#00259E',
          900: '#001A7A',
        },
        sky: {
          50:  '#E0F5FF',
          100: '#BDE9FF',
          200: '#90DAFF',
          300: '#5DC5FF',
          400: '#22A8FF',
          500: '#00A4FF', // Sky Blue
          600: '#0082D9',
          700: '#0068B0',
          800: '#00558F',
          900: '#004775',
        },
        neon: {
          50:  '#E0FDFF',
          100: '#B5FAFF',
          200: '#7AF5FF',
          300: '#2EEBFF',
          400: '#00E7FF', // Neon Blue
          500: '#00CFE5',
          600: '#00A7BA',
          700: '#008494',
          800: '#006975',
          900: '#005861',
        },
        primary: {
          50:  '#E0FDFF',
          100: '#B5FAFF',
          200: '#7AF5FF',
          300: '#2EEBFF',
          400: '#00E7FF',
          500: '#00CFE5',
          600: '#00A7BA',
          700: '#008494',
          800: '#006975',
          900: '#005861',
          950: '#00363D',
        },
        surface: {
          50:  '#EBF2FF',
          100: '#D6E4FF',
          200: '#ADC7FF',
          300: '#80A7FF',
          400: '#0068B0',
          500: '#0082D9',
          600: '#00558F',
          700: '#004775',
          800: '#00259E',
          900: '#001A7A',
          950: '#000B75',
        },
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(0, 11, 117, 0.2), 0 2px 6px -1px rgba(0, 11, 117, 0.1)',
        'warm-md': '0 10px 25px -3px rgba(0, 11, 117, 0.3), 0 4px 10px -2px rgba(0, 11, 117, 0.2)',
        'neon-lg': '0 20px 35px -5px rgba(0, 231, 255, 0.15), 0 8px 16px -4px rgba(0, 231, 255, 0.1)',
        'sky': '0 8px 24px -4px rgba(0, 164, 255, 0.4)',
        'neon': '0 8px 24px -4px rgba(0, 231, 255, 0.3)',
        'glass': '0 8px 32px 0 rgba(4, 4, 74, 0.4)',
        'glass-sm': '0 4px 16px 0 rgba(4, 4, 74, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
