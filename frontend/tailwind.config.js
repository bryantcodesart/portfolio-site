// eslint-disable-next-line import/no-extraneous-dependencies
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        landscape: { raw: '(min-aspect-ratio: 1 / 1)' },
      },
    },
    colors: {
      transparent: 'transparent',
      blue: '#001AFF',
      white: '#ffffff',
    },
    fontFamily: {
      mono: '"Roboto Mono", monospace',
    },
  },

  plugins: [
    plugin(({ addUtilities }) => {
      // Add your custom styles here
      addUtilities({
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    }),
  ],
};