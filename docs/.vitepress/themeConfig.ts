import { DefaultTheme } from "vitepress";

/**
 * @see https://vitepress.dev/reference/default-theme-config
 */
export const defineThemeConfig = (config: DefaultTheme.Config): DefaultTheme.Config => ({
  logo: '/assets/logo.png',

  socialLinks: [
    { icon: 'github', link: 'https://github.com/HotariTobu/manaba-plus' },
    { icon: 'twitter', link: 'https://twitter.com/manaba_plus' }
  ],

  footer: {
    message: 'Released under the <a href="https://github.com/HotariTobu/manaba-plus/blob/main/LICENSE">The Unlicense</a>. <a href="./privacy-policy">Privacy Policy</a>',
    copyright: 'Copyright © 2024 manaba.plus@gmail.com'
  },

  ...config,
})
