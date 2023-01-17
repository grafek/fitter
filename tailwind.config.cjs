/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation:{
        spinBezier: 'spin 1s cubic-bezier(.48,.18,.57,.87) infinite'
      }
    },
  },
  plugins: [],
};
