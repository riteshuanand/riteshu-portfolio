/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      // all colors run through CSS variables so dark mode flips everything at once
      colors: {
        cream: 'rgb(var(--cream) / <alpha-value>)', // page background
        ink: 'rgb(var(--ink) / <alpha-value>)', // primary text
        accent: 'rgb(var(--accent) / <alpha-value>)', // coral
        peri: 'rgb(var(--peri) / <alpha-value>)', // periwinkle
        muted: 'rgb(var(--muted) / <alpha-value>)', // secondary text
        surface: 'rgb(var(--surface) / <alpha-value>)', // cards / nav
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
