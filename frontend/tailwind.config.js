// eslint-disable-next-line import/no-extraneous-dependencies
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        sm: '400px',
        landscape: { raw: '(min-aspect-ratio: 1 / 1)' },
      },
      // https://github.com/tailwindlabs/tailwindcss/discussions/2599#discussioncomment-2965375
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      // keyframes: {
      //   throb: {
      //     '0%, 10%, 100%': { transform: 'scale(1)' },
      //     '4%': { transform: 'scale(1.1)' },
      //   },
      // },
    },
    // animation: {
    //   spin: 'spin 5s linear infinite',
    // },
    colors: {
      transparent: 'transparent',
      blue: '#001AFF',
      white: '#ffffff',
      black: '#000000',
      cyan: '#00FFFF',
      violet: '#ff00ff',
      lime: '#00ff00',
      lemonlime: '#ccff00',
      green: '#03fc20',
      orange: '#FFC700',
      yellow: '#ffff00',
      coffee: '#551F00',
      projectColor: 'var(--projectColor)',
    },
    fontFamily: {
      mono: '"Roboto Mono", monospace',
      sans: '"Roboto", sans-serif',
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
          // eslint-disable-next-line comma-dangle
        }
      );
    }),
  ],
};
