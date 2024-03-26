import { cn } from "@/lib/utils"
import { t } from "@/utils/i18n"

/** Represent that the course is linked to another */
export const CourseLink = (props: {
  linked: boolean
  className?: string
}) => (
  <div className={cn("text-orange-300", props.className)}>{props.linked && t('home_courses_course_linked')}</div>
)
