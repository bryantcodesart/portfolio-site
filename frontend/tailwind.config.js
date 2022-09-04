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
      // https://github.com/tailwindlabs/tailwindcss/discussions/2599#discussioncomment-2965375
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
    colors: {
      transparent: 'transparent',
      blue: '#001AFF',
      black: '#000000',
      white: '#ffffff',
    },
    fontFamily: {
      mono: '"Roboto Mono", Comic Sans MS',
      sans: '"Roboto", Comic Sans MS',
      display: '"Bryant", Comic Sans MS',
    },
  },

  plugins: [
    plugin(({ addUtilities, matchUtilities, theme }) => {
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

      matchUtilities(
        {
          glow: (value) => ({
            filter: `drop-shadow(0 0 ${value} currentColor)`,
          }),
        },
        {
          values: theme('spacing'),
        }
      );
    }),
  ],
};
