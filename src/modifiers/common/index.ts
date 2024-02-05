import './style.scss'
import modify from '@/utils/modify'
import hide from './hide'
import replace from './replace'
import { o } from '@/stores/options'
import { addClass } from '@/utils/element'
import { arrangeMap } from './config'

modify(() => {
  if (o.common.makeResponsive.value) {
    addClass(arrangeMap.makeResponsive)
  }

  hide()
  replace()

  // $('<link>', {
  //   rel: 'stylesheet',
  //   href: chrome.runtime.getURL('style.css'),
  //   type: 'text/css;charset=UTF-8',
  // }).appendTo(document.head)
})
