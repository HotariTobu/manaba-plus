import { createApp } from 'vue'
import HomeButton from './HomeButton.vue'
import vuetify from '@/plugins/vuetify'
import { classMap } from './config'
import { c } from '@/utils/element'

/**
 * Insert a button to jump to the home page in the center of the screen.
 */
const insertHomeButton = () => {
  const container = c('div', {
    className: classMap.container,
  })
  createApp(HomeButton).use(vuetify).mount(container)
  document.body.appendChild(container)

  // Remove the button if the page is a redirect page.
  window.addEventListener('beforeunload', () => {
    container.remove()
  })
}

// Entry point
export default () => {
  insertHomeButton()
}
