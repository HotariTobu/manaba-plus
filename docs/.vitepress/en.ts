import { defineConfig } from "vitepress";
import { defineThemeConfig } from "./themeConfig";

export const en = defineConfig({
  lang: 'en',
  description: 'A site for PR of Manaba Plus',

  themeConfig: defineThemeConfig({
    editLink: {
      pattern: 'https://github.com/HotariTobu/manaba-plus/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    }
  })
})
