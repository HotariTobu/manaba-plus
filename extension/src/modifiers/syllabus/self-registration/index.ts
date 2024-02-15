import { c, ff } from "@/utils/element"
import { t } from "@/utils/i18n"
import { classMap, getSelfRegistrationUrl, selectorMap } from "../config"

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
    textContent: t('syllabus_to_self_registration'),
  })
  container.prepend(anchor)
}

// Entry point
export default () => {
  insertSelfRegistrationAnchor()
}
