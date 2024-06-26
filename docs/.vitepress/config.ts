import { defineConfig } from 'vitepress'
import { homePageUrl } from '../../constants.json'
import { en } from './en'
import { ja } from './ja'

/** The prefix path */
// const base = '/manaba-plus/'
const base = '/'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base,
  title: 'Manaba Plus',

  lastUpdated: true,

  /* prettier-ignore */
  head: [
    ['link', { rel: 'icon', href: `${base}logo.png` }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap' }],
  ],

  locales: {
    // root: { label: 'English', ...en },
    ja: { label: '日本語', ...ja },
  },

  sitemap: {
    hostname: homePageUrl,
  },
})
