import { t } from "@/utils/i18n"
import { DayOfWeek, type Course } from "../types/course"
import { isDummyCourse } from "../layout"
import { CourseCell } from "./course-cell"

const headers: Record<DayOfWeek, string> = {
  [DayOfWeek.Monday]: t('home_courses_Monday'),
  [DayOfWeek.Tuesday]: t('home_courses_Tuesday'),
  [DayOfWeek.Wednesday]: t('home_courses_Wednesday'),
  [DayOfWeek.Thursday]: t('home_courses_Thursday'),
  [DayOfWeek.Friday]: t('home_courses_Friday'),
  [DayOfWeek.Saturday]: t('home_courses_Saturday'),
  [DayOfWeek.Sunday]: t('home_courses_Sunday'),
  [DayOfWeek.Count]: '',
}

const getMinMaxPeriod = (courses: Course[]) => {
  const firstCourse = courses.find(course => !isDummyCourse(course))
  const lastCourse = courses.findLast(course => !isDummyCourse(course))
  const minPeriod = firstCourse?.period?.start ?? 1
  const maxPeriod = (lastCourse?.period?.start ?? 1) + (lastCourse?.period?.span ?? 1) - 1
  return {
    minPeriod,
    maxPeriod,
  }
}

const getNotEmptyDays = (courses: Course[], minPeriod: number) => {
  const startRow = minPeriod - 1

  const notEmptyDays = [...Array(DayOfWeek.Count).keys()].filter(
    day => {
      const column = day

      for (let index = startRow * DayOfWeek.Count + column; index < courses.length; index += DayOfWeek.Count) {
        const course = courses[index]
        if (!isDummyCourse(course)) {
          return true
        }
      }

      return false
    }
  )

  return notEmptyDays
}

export const CourseTimetable = (props: {
  courses: Course[]
}) => {
  // Optimize courses.
  const { minPeriod, maxPeriod } = getMinMaxPeriod(props.courses)
  const notEmptyDays = getNotEmptyDays(props.courses, minPeriod)

  if (notEmptyDays.length === 0) {
    return
  }

  const startDay = notEmptyDays[0]
  const endDay = notEmptyDays[notEmptyDays.length - 1]

  const dayCount = endDay - startDay + 1
  const periodSpan = maxPeriod - minPeriod + 1

  const filteredCourses = props.courses.filter((_, index) => {
    const period = Math.floor(index / DayOfWeek.Count) + 1
    if (period < minPeriod) {
      return false
    }

    const day = index % DayOfWeek.Count
    if (day < startDay || endDay < day) {
      return false
    }

    return true
  })

  return (
    <div className="gap-1 grid overflow-x-auto" style={{
      gridTemplateColumns: `auto repeat(${dayCount}, 1fr)`,
      gridTemplateRows: `auto repeat(${periodSpan}, minmax(0, 1fr))`,
    }}>
      <div className="gap-1 grid grid-cols-subgrid col-start-2 col-end-[-1]">
        {[...Array(dayCount).keys()].map(i => {
          const day = startDay + i
          return (
            <div className="p-2 text-center font-bold rounded bg-primary text-primary-foreground" key={day}>
              {headers[day as DayOfWeek]}
            </div>
          )
        })}
      </div>
      <div className="gap-1 grid grid-rows-subgrid row-start-2 row-end-[-1]">
        {[...Array(periodSpan).keys()].map(i => {
          const period = minPeriod + i
          return (
            <div className="p-2 text-center flex items-center rounded bg-slate-100" key={period}>
              {period}
            </div>
          )
        })}
      </div>
      <div className="gap-1 grid grid-cols-subgrid col-start-2 col-end-[-1] grid-rows-subgrid row-start-2 row-end-[-1]">
        {filteredCourses.map(course => (
          <CourseCell course={course} key={course.id} />
        ))}
      </div>
    </div>
  )
}
