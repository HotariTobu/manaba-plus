import { ArrangeMap } from "@/types/config"

export const arrangeMap = {
  rem: {
    selector: 'html',
    className: 'text-[100%]'
  },
} satisfies ArrangeMap

/**
 * Convert a root url into a home url.
 * @param rootUrl The root url
 * @returns The home url
 */
export const getHomeUrl = (rootUrl: string) => {
  return rootUrl + 'home'
}
