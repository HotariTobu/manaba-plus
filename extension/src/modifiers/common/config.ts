import { ArrangeMap, SelectorMap, } from "@/types/config"

export const arrangeMap = {
  privacy: {
    selector: '#screenname, .pageheader-course-coursename a:not(#coursename)',
    className: 'opacity-0',
  },
  makeResponsive: {
    selector: 'body',
    className: 'responsive',
  }
} satisfies ArrangeMap

export const selectorMap = {
  externalAnchor: 'a[href*="link_iframe_balloon"]',
  notes: '.memo, a[href="home_usermemo"]',
} satisfies SelectorMap

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
