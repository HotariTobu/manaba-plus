import { modify } from '@/utils/modify'
import { arrangeMap, getRootUrl } from './config'
import dock from './dock'
import { o } from '@/store'
import { addClass } from '@/utils/element'

debug: {
  addClass(arrangeMap.privacy)
}

// Store the root url.
if (o.rootUrl === '') {
  const rootUrl = getRootUrl(location.href)
  if (rootUrl !== null) {
    o.rootUrl = rootUrl
  }
}

modify(() => {
  dock()
})
