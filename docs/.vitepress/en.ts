import { defineConfig } from "vitepress";
import { defineThemeConfig } from "./themeConfig";
import { githubUrl } from '../../constants.json'

export const en = defineConfig({
  lang: 'en',
  description: 'A site for PR of Manaba Plus',

  themeConfig: defineThemeConfig({
    editLink: {
      pattern: `${githubUrl}/edit/main/docs/:path`,
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
