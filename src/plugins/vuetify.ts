// import 'vuetify/styles'
import './vuetify.scss'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

import colors from '@/color.json'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colors.primary,
          secondary: colors.primaryLight,
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: colors.primary,
          secondary: colors.primaryDark,
        }
      },
    },
  },
})

export default vuetify
