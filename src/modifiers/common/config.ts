import { defineArrangeMap, defineSelectorMap } from "@/types/config"

export const arrangeMap = defineArrangeMap({
  makeResponsive: {
    selector: 'body',
    className: 'responsive',
  }
})

export const selectorMap = defineSelectorMap({
  externalAnchor: 'a[href*="link_iframe_balloon"]',
  notes: '.memo, a[href="home_usermemo"]',
})

/**
 * Extract an external url from a ballon url.
 * @param ballonUrl The ballon url
 * @returns An external url, or null if not found
 */
export const getExternalUrl = (ballonUrl: string) => {
  const match = /url=(.+)/.exec(ballonUrl)
  if (match === null) {
    return null
  }

  return decodeURIComponent(match[1])
}
