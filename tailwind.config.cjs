/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        spinBezier: "spin 1s cubic-bezier(.5,0,.5,1) infinite",
      },
    },
  },
  plugins: [],
};
