const colors = require('./src/color.json')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,vue,json}"],
  theme: {
    colors: {
      primary: colors.primary,
      secondary: {
        light: colors.primaryLight,
        dark: colors.primaryDark,
      },
    },
    extend: {},
  },
  plugins: [],
}
