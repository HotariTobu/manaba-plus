import { addClass, c } from '@/utils/element'
import { o } from '@/stores/options'
import { arrangeMap } from '../config'

export default () => {
  if (o.common.makeResponsive.value) {
    // Enable mobile mode when the window width is short.
    addClass(arrangeMap.makeResponsive)
  }
}
