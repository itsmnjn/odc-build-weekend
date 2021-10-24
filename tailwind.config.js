/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', ...fontFamily.sans],
      },
      colors: {
        'odc-border-gray': '#E2E4E8',
        'odc-text-gray': '#B2B7C2',
        'odc-text-dark-gray': '#525C76',
        'odc-purple': '#8D49F7',
        'odc-dark-purple': '#6B53FF',
        'odc-disabled-gray': '#EEEFF2',
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: 0.99,
            filter:
              'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: 0.4,
            filter: 'none',
          },
        },
        pop: {
          '0%': {
            transform: 'scale(0.2)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
      },
      animation: {
        flicker: 'flicker 3s linear infinite',
        pop: 'pop 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
