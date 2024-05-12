import { DefaultTheme } from "vitepress";
import { githubUrl, profileUrl } from '../../constants.json'

/**
 * @see https://vitepress.dev/reference/default-theme-config
 */
export const defineThemeConfig = (config: DefaultTheme.Config): DefaultTheme.Config => ({
  logo: '/logo.png',

  socialLinks: [
    { icon: 'github', link: githubUrl },
    { icon: 'twitter', link: profileUrl.X }
  ],

  footer: {
    message: `Released under the <a href="${githubUrl}/blob/main/LICENSE">The Unlicense</a>. <a href="./privacy-policy">Privacy Policy</a>`,
    copyright: 'Copyright © 2024 manaba.plus@gmail.com'
  },

  ...config,
})
