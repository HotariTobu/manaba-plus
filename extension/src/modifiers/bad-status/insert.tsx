import { mount } from '@/utils/mount'
import { HomeButton } from './home-button'

/**
 * Insert a button to jump to the home page in the center of the screen.
 */
const insertHomeButton = () => {
  const container = mount(<HomeButton />)
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
