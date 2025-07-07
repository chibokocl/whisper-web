/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        grey: {
          900: '#373737',
          800: '#565656',
          700: '#828385',
          600: '#A0A1A4',
          500: '#C0C0C2',
          400: '#ACBABF',
          50: '#fff',
        },
      },
    },
  },
  plugins: [],
}
