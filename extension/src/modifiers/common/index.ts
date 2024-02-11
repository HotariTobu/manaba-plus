import { modify } from '@/utils/modify'
import { addClass, c } from '@/utils/element'
import { o } from '@/stores/options'
import { arrangeMap } from './config'
import hide from './hide'
import replace from './replace'

modify(() => {
  if (o.common.makeResponsive.value) {
    addClass(arrangeMap.makeResponsive)
  }

  hide()
  replace()
})
