import { o } from '@/stores/options'
import { c, replace } from '@/utils/element'
import { getExternalUrl, selectorMap } from './config'
import { getSvg } from '@/utils/mdi'
import { mdiOpenInNew } from '@mdi/js'

/**
 * Extract the external URL and replace an anchor element with a new one.
 * @param pastAnchor The anchor element replaced with
 */
const replaceExternalAnchor = function (pastAnchor: HTMLAnchorElement) {
  // Extract the external URL.
  const externalUrl = getExternalUrl(pastAnchor.href)
  if (externalUrl === null) {
    return null
  }

  // Create a new anchor.
  const svg = getSvg(mdiOpenInNew, {
    width: '1em'
  })

  const anchor = c('a', {
    href: externalUrl,
    target: '_blank',
    textContent: pastAnchor.textContent,
  })
  anchor.appendChild(svg)

  return anchor
}

// Entry point
export default function () {
  if (o.common.transitionDirectly.value) {
    // Replace all external anchors in the document.
    replace(selectorMap.externalAnchor, replaceExternalAnchor)
  }
}
