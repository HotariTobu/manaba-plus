import './style.scss'
// import arrange from './arrange'
// import replace from './replace'
// import hide from './hide'
// import move from './move'
// import insert from './insert'
// import event from './event'
import modify from '@/utils/modify'
import { o } from '@/stores/options'
import { getRootUrl } from './config'
import arrange from './arrange'
import insert from './insert'
import event from './event'
import replace from './replace'

if (o.common.rootUrl.value === '') {
  const rootUrl = getRootUrl(location.href)
  if (rootUrl !== null) {
    o.common.rootUrl.value = rootUrl
  }
}

modify(() => {
  replace()
  // arrange()
  // insert()

  // event()
})


// // Entry point.
// getOptions().then(async function ({ options }) {

//   if (!options.common['allow-changing'].value) {
//     return
//   }

//   await arrange()
//   await replace()
//   await hide()
//   await move()
//   await insert()
//   await event()

//   if (options.home['show-home-panel'].value) {
//     const contentBodyLeft = document.querySelector('#content-body .left')
//     if (contentBodyLeft !== null) {
//       await initMainPanel(contentBodyLeft)
//     }
//   }
// })
