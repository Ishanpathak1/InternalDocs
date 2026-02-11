/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
