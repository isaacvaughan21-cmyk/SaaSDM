/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        // Editorial ink-on-paper brand. Colour is reserved for data viz.
        paper: '#FBFAF6',
        surface: '#FFFFFF',
        ink: { DEFAULT: '#1B1A17', 700: '#2C2A26', 600: '#46423B', 50: '#F1EFEA' },
        line: '#E8E2D7',
        wash: '#F4F2EC',
        muted: '#6B6660',
        // Okabe-Ito colorblind-safe palette for scores
        good: { light: '#d6e9f5', DEFAULT: '#0072B2' },
        mid: { light: '#fbeccc', DEFAULT: '#E69F00' },
        bad: { light: '#f7dbcb', DEFAULT: '#D55E00' },
      },
      boxShadow: {
        card: '0 1px 2px rgba(27, 26, 23, 0.04), 0 1px 1px rgba(27, 26, 23, 0.03)',
        lift: '0 8px 30px rgba(27, 26, 23, 0.08)',
      },
    },
  },
  plugins: [],
}
