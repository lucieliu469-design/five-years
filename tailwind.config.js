/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        journal: {
          50: '#FFF8F0',
          100: '#F5E8D8',
          200: '#E8D5BE',
          300: '#D6A77A',
          400: '#C49565',
          500: '#B88455',
          600: '#A47345',
          700: '#8E6E53',
          800: '#7A5E45',
          900: '#664E38',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
