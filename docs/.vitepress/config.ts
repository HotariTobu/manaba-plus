import { defineConfig } from 'vitepress'
import { en } from './en'
import { ja } from './ja'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Manaba Plus',

  lastUpdated: true,

  /* prettier-ignore */
  head: [
    ['link', {rel: 'icon', href: '/assets/logo.png'}],
    ['link', {rel: 'preconnect', href: 'https://fonts.googleapis.com'}],
    ['link', {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: ''}],
    ['link', {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap'}],
  ],

  locales: {
    // root: { label: 'English', ...en },
    ja: { label: '日本語', ...ja },
  }
})
