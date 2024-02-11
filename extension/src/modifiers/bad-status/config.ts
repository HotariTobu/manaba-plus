import { defineClassMap } from "@/types/config"

/**
 * Convert a root url into a home url.
 * @param rootUrl The root url
 * @returns The home url
 */
export const getHomeUrl = (rootUrl: string) => {
  return rootUrl + 'home'
}
