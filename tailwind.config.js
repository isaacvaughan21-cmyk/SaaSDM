/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Okabe-Ito colorblind-safe palette + redundant shapes elsewhere
        good: { light: '#d6e9f5', DEFAULT: '#0072B2' }, // blue
        mid: { light: '#fbeccc', DEFAULT: '#E69F00' }, // orange
        bad: { light: '#f7dbcb', DEFAULT: '#D55E00' }, // vermillion
      },
    },
  },
  plugins: [],
}
