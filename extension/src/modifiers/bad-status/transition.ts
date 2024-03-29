import { o } from "@/stores/options"
import { getHomeUrl } from "./config"
import { z } from "zod"

let url = o.timeout.destinationOnTimeout.value.trim()
if (url === '') {
  // Set the home page URL.
  const rootUrl = o.common.rootUrl.value
  url = getHomeUrl(rootUrl)
}

const urlSchema = z.string().url()
const { success } = urlSchema.safeParse(url)

/**
 * True if the url is invalid, otherwise false
 */
export const invalidUrl = !success

/**
 * Transition to another page.
 */
let isTransitioning = false
export const transition = async () => {
  if (isTransitioning) {
    return
  }

  isTransitioning = true

  if (invalidUrl) {
    return
  }

  window.location.href = url
}
