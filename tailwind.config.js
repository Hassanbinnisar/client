/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  screens: {
    'xs': '475px',
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
  },

  theme: {
    extend: {
      colors: {
        'custom-bg': '#cf5deb3b',
        'custom-gold': '#966919',
        candle: {
          50: '#fef7f2',
          500: '#f59e0b',
          900: '#7c2d12',
        }
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #cf5deb' },
          '100%': { boxShadow: '0 0 20px #cf5deb, 0 0 30px #cf5deb' },
        }
      }
    },
  },
  plugins: [],
}

