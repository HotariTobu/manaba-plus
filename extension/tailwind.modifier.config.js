import base from './tailwind.config.js'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [
    base,
  ],
  important: true,
  corePlugins: {
    preflight: false,
  },
  blocklist: [
    'contents',
  ]
}
