import { o } from "@/stores/options"
import { addClass } from "@/utils/element"
import { arrangeMap } from "../config"

/**
 * Highlight the open period.
 */
const highlightOpenPeriod = () => {
  if (o.resourcesPage.highlightOpenPeriod.value) {
    addClass(arrangeMap.openPeriod)
  }
}

// Entry point
export default () => {
  highlightOpenPeriod()
}
