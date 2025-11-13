const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
    './apps/**/*.{html,ts,tsx,js,jsx}',
    './libs/**/*.{html,ts,tsx,js,jsx}'
  ],
  theme: {
    screens: {
      'sm': '576px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '992px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1296px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      fontFamily: {
        sans: ["Golos", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
