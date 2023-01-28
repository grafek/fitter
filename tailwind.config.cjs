/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        spinBezier: "spin 1s cubic-bezier(.5,0,.5,1) infinite",
        push: "push 0.3s linear infinite",
      },
      keyframes: {
        push: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.75)" },
        },
      },
    },
  },
  plugins: [],
};
