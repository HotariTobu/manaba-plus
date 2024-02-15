export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-add-root-selector': {
      rootSelector: '.tailwind-container',
      include: ['modifier-component.css'],
    },
  },
}
