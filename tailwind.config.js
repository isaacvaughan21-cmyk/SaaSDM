/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        green: { light: '#dcfce7', DEFAULT: '#16a34a' },
        yellow: { light: '#fef9c3', DEFAULT: '#ca8a04' },
        red: { light: '#fee2e2', DEFAULT: '#dc2626' },
      },
    },
  },
  plugins: [],
}
