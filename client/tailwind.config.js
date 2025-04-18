/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f7c221',
        secondary: '#0F3460', 
      },
    },
  },
  plugins: [],
}

