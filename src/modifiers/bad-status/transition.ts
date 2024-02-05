import { o } from "@/stores/options"
import isValidUrl from "@/utils/isValidUrl"
import { getHomeUrl } from "./config"

let url = o.timeout.destinationOnTimeout.value.trim()
if (url === '') {
  // Set the home page URL.
  const rootUrl = o.common.rootUrl.value
  url = getHomeUrl(rootUrl)
}

// Whether the url is invalid.
export const invalidUrl = !isValidUrl(url)

/**
 * Transition to another page.
 */
let isTransitioning = false
export default async function () {
  if (isTransitioning) {
    return
  }

  isTransitioning = true

  if (invalidUrl) {
    return
  }

  window.location.href = url
}
