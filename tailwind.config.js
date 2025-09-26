/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        creme: "#ffffe3", // your main background
        charcoal: "#2E2E2E", // for text
      },
      fontFamily: {
        clash: ["ClashDisplay", "sans-serif"],
        satoshi: ["Satoshi", "sans-serif"],
      },
    },
  },
  plugins: [],
};
