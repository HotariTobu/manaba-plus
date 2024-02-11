import { o } from '@/stores/options'
import { c, replace } from '@/utils/element'
import { getSvg } from '@/utils/radixIcon'
import { getExternalUrl, selectorMap } from './config'

import { OpenInNewWindowIcon } from '@radix-ui/react-icons'
import { renderToStaticMarkup } from 'react-dom/server'

// Convert icon component into plain html
const openInNewWindowIcon = renderToStaticMarkup(<OpenInNewWindowIcon />)
const pathDataMatch = /<path.+?d="([^"]+?)".*?>/.exec(openInNewWindowIcon)
if (pathDataMatch === null) {
  throw Error('Cannot extract path data of icon')
}
const openInNewWindowIconData = pathDataMatch[1]

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
  const svg = getSvg(openInNewWindowIconData, {
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
export default () => {
  if (o.common.transitionDirectly.value) {
    // Replace all external anchors in the document.
    replace(selectorMap.externalAnchor, replaceExternalAnchor)
  }
}
