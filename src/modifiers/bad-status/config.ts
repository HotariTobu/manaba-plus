import { defineClassMap } from "@/types/config"

export const classMap = defineClassMap({
  container: 'absolute w-fit h-fit inset-1/2 -translate-x-1/2 -translate-y-1/2',
})

/**
 * Convert a root url into a home url.
 * @param rootUrl The root url
 * @returns The home url
 */
export const getHomeUrl = (rootUrl: string) => {
  return rootUrl + 'home'
}
