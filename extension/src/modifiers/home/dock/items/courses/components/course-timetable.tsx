import { t } from "@/utils/i18n"
import { DayOfWeek, type Course, days } from "../types/course"
import { CourseCell } from "./course-cell"
import { ItemsMap } from "@/components/sortable/item"
import { isDummyCourse } from "../utils/dummy"
import { dynamicStore, store } from "../store"

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

const getBoundingBox = (coursesList: Course[][]) => {
  let left = Infinity
  let top = Infinity
  let right = -Infinity
  let bottom = -Infinity
  let maxRowCount = 0

  for (const courses of coursesList) {
    let rowCount = 0

    for (const course of courses) {
      const coordinate = store.timetableCoordinates.get(course.id)
      if (typeof coordinate === 'undefined') {
        rowCount += 1
        continue
      }

      const { column, row } = coordinate
      const span = dynamicStore.span.get(course.id)

      left = Math.min(left, column)
      right = Math.max(right, column)

      if (typeof row !== 'undefined') {
        top = Math.min(top, row)
        bottom = Math.max(bottom, row + span)
      }

      rowCount += span
    }

    maxRowCount = Math.max(maxRowCount, rowCount)
  }

  const width = right - left + 1
  const height = bottom - top + 1

  if (isFinite(width) && isFinite(height)) {
    return {
      left,
      top,
      width,
      height,
      maxRowCount,
    }
  }

  return null
}

export const CourseTimetable = (props: {
  coursesMap: ItemsMap<Course>
}) => {
  const mainCoursesList = days.map(day => props.coursesMap.get(`main-${day}`) ?? [])
  const otherCoursesList = days.map(day => props.coursesMap.get(`other-${day}`) ?? [])

  // Optimize courses.
  const boundingBox = getBoundingBox(mainCoursesList.concat(otherCoursesList))
  const { left: col1, width: col2, top: row1, height:  } = boundingBox ?? {
    left: 0,
    top: 0,
    width: DayOfWeek.Count,
    height: 1,
  }

  return (
    <div className="gap-1 grid overflow-x-auto" style={{
      gridTemplateColumns: `auto repeat(${DayOfWeek.Count}, 1fr)`,
      gridTemplateRows: `auto repeat(10, minmax(0, 1fr))`,
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
