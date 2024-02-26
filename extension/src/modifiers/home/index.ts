import { modify } from '@/utils/modify'
import { o } from '@/stores/options'
import { getRootUrl } from './config'
import dock from './dock'

// Store the root url.
if (o.common.rootUrl.value === '') {
  const rootUrl = getRootUrl(location.href)
  if (rootUrl !== null) {
    o.common.rootUrl.value = rootUrl
  }
}

modify(() => {
  dock()
})
