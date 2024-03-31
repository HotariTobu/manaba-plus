import { modify } from '@/utils/modify'
import { getRootUrl } from './config'
import dock from './dock'
import { o } from '@/store'

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
