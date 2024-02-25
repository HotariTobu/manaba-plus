import { mount } from '@/utils/mount'
import { addClass } from '@/utils/element'
import { arrangeMap } from '../config'
import { HomeButton } from './component'

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

/**
 * Reset the root font-size.
 */
const resetREM = () => {
  addClass(arrangeMap.rem)
}

// Entry point
export default () => {
  insertHomeButton()
  resetREM()
}
