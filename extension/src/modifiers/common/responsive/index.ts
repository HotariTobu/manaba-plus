import { o } from '@/stores/options'
import { addClass } from '@/utils/element'
import { arrangeMap } from '../config'

const addResponsiveClass = () => {
  if (o.common.makeResponsive.value) {
    // Enable mobile mode when the window width is short.
    addClass(arrangeMap.makeResponsive)
  }
}

export default () => {
  setTimeout(addResponsiveClass, 1000)
}
