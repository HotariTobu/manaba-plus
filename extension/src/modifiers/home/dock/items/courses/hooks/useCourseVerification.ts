import { toast } from "sonner"
import { getThumbnailFormatUrl, selectorMap } from "../../../../config"
import { ff } from "@/utils/element"
import { t } from "@/utils/i18n"
import { useEffect } from "react"
import { periodsGetterSupported } from "../period"
import {profileUrl} from '@/../../constants.json'

/**
 * Determine if the page has enough course data.
 * If not, prompt the user to load the thumbnail formatted courses page.
 */
const verifyCoursesSource = () => {
  if (ff(selectorMap.courses.timetable.source) === null) {
    return
  }

  const onClick = () => {
    location.href = getThumbnailFormatUrl(location.href)
  }

  toast(t('home_courses_verify_courses_source_description'), {
    action: {
      label: t('home_courses_verify_courses_source_action'),
      onClick,
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

  const onClick = () => {
    open(profileUrl.X)
  }

  toast(t('home_courses_verify_period_getter_description'), {
    action: {
      label: t('home_courses_verify_period_getter_action'),
      onClick,
    }
  })
}

let verified = false

export const useCourseVerification = () => {
  useEffect(() => {
    if (verified) {
      return
    }
    verified = true

    setTimeout(verifyCoursesSource)
    setTimeout(verifyPeriodGetter)
  }, [])
}
