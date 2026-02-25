/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        handwriting: ['"Segoe Print"', '"Comic Sans MS"', 'cursive'],
      },
      colors: {
        'brand-light': '#CFF1F9',
        'brand-blue': '#71C6D9',
      },
    },
  },
  plugins: [],
};
