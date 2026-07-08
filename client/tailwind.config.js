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
        primary: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#b3c7ff',
          400: '#85a3ff',
          500: '#5376ff',
          600: '#3352eb',
          700: '#253ccf',
          800: '#2234a8',
          900: '#202f85',
          950: '#141c52',
        },
        dark: {
          50: '#f6f6f7',
          100: '#e1e1e4',
          200: '#c2c2c9',
          300: '#9b9ba6',
          400: '#737380',
          500: '#585864',
          600: '#464650',
          700: '#3a3a42',
          800: '#2d2d34',
          900: '#1f1f23',
          950: '#151518',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
