import rootClass from './src/root-class.json' with { type: "json" }

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-add-root-selector': {
      rootSelector: `.${rootClass}`,
      include: ['modifier-component.css'],
    },
  },
}
