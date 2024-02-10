import { t } from "@/composables/useT9n"
import { classMap, getSelfRegistrationUrl, selectorMap } from "./config"
import { c, ff } from "@/utils/element"

/**
 * Insert an anchor to the self-registration page.
 */
const insertSelfRegistrationAnchor = () => {
  const selfRegistrationUrl = getSelfRegistrationUrl(location.href)
  if (selfRegistrationUrl === null) {
    return
  }

  const container = ff(selectorMap.selfRegistrationContainer)
  if (container === null) {
    return
  }

  // Create anchor.
  const anchor = c('a', {
    className: classMap.selfRegistrationAnchor,
    href: selfRegistrationUrl,
    textContent: t.syllabus.selfRegistration,
  })
  container.prepend(anchor)
}

// Entry point
export default function () {
  insertSelfRegistrationAnchor()
}
