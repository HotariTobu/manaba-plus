import { toast } from "sonner"
import { getThumbnailFormatUrl, selectorMap } from "../../../../config"
import { ff } from "@/utils/element"
import { t } from "@/utils/i18n"
import { periodsGetterSupported } from "../period"
import { profileUrl } from '@/../../constants.json'
import { defineOnceHook } from "../../../../utils/defineOnceHook"

/**
 * Determine if the page has enough course data.
 * If not, prompt the user to load the thumbnail formatted courses page.
 */
const verifyCoursesSource = () => {
  if (ff(selectorMap.courses.timetable.source) === null) {
    return
  }

  toast(t('home_courses_verify_courses_source_description'), {
    action: {
      label: t('home_courses_verify_courses_source_action'),
      onClick: () => {
        location.href = getThumbnailFormatUrl(location.href)
      },
    }
  })
}

/**
 * Determine if the host is supported for period getters.
 * If not, prompt the user to notify in X.
 */
const verifyPeriodGetter = () => {
  if (periodsGetterSupported) {
    return
  }

  toast(t('home_courses_verify_period_getter_description'), {
    action: {
      label: t('home_courses_verify_period_getter_action'),
      onClick: () => {
        open(profileUrl.X)
      },
    }
  })
}

export const useCourseVerification = defineOnceHook(() => {
  setTimeout(verifyCoursesSource)
  setTimeout(verifyPeriodGetter)
})
