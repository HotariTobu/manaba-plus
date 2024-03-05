import { ItemsMap } from "@/components/sortable/item"
import { fromLayout, toLayout } from "../../../../layout"
import { dynamicStore, store } from "../../store"
import { Course, days } from "../../types/course"
import { TimetableCoordinate } from "../../types/timetableCoordinate"
import { createDummyCourse, isDummyCourse } from "../../utils/dummy"
import { getCourses } from "./courses"

/**
 * Get where the course should be located at.
 * @param course The course
 * @returns The default position
 */
export const getCourseDefaultPosition = (course: Course) => {
  const coordinate = store.timetableCoordinates.get(course.id)
  if (typeof coordinate === 'undefined') {
    if (typeof course.url === 'undefined') {
      return 'hidden'
    }

    return 'rest'
  }
  else {
    if (typeof coordinate.row === 'undefined') {
      return `other-${coordinate.column}`
    }

    return `main-${coordinate.column}`
  }
}

/**
 * Combine positions and courses.
 * @returns An array of tuples of default position and course
 */
const getCoursePairs = () => {
  const courses = getCourses()

  const coursePairs = courses.map<[string, Course]>(course => {
    const position = getCourseDefaultPosition(course)
    return [position, course]
  })

  return coursePairs
}

/**
 * List all course positions.
 * @returns An array of positions
 */
const getPositions = () => {
  const positions = [
    'rest',
    'hidden',
  ]

  for (const day of days) {
    positions.push(
      `main-${day}`,
      `other-${day}`,
    )
  }

  return positions
}

/**
 * Insert dummy courses into main courses for the timetable format.
 * @param coursesMap The target courses map
 */
const insertDummyCourses = (coursesMap: ItemsMap<Course>) => {
  const restCourses = coursesMap.get('rest') ?? []

  for (const day of days) {
    const mainCourses = coursesMap.get(`main-${day}`) ?? []
    const otherCourses = coursesMap.get(`other-${day}`) ?? []

    // Re-insert main courses.
    for (const course of mainCourses.splice(0)) {
      const coordinate = store.timetableCoordinates.get(course.id)
      if (typeof coordinate === 'undefined') {
        restCourses.push(course)
        continue
      }

      if (typeof coordinate.row === 'undefined') {
        otherCourses.push(course)
        continue
      }

      mainCourses[coordinate.row] = course
    }

    // Replace empty items with dummy courses.
    for (let index = 0; index < mainCourses.length; index++) {
      const course = mainCourses[index];
      if (typeof course === 'undefined') {
        mainCourses[index] = createDummyCourse()
        continue
      }

      const span = dynamicStore.span.get(course.id)
      if (span === 1) {
        continue
      }

      // Skip for a long span course.
      mainCourses.splice(index + 1, span - 1)
    }
  }
}

/**
 * Flatten the tails of main courses.
 * @param coursesMap The target courses map
 */
export const refreshCoursesMap = (coursesMap: ItemsMap<Course>) => {
  const mainCoursesList = days.map(day => coursesMap.get(`main-${day}`) ?? [])

  const rowCounts = mainCoursesList.map(courses => {
    return courses.reduce((rowCount, course) => {
      if (isDummyCourse(course)) {
        return rowCount + 1
      }
      else {
        const span = dynamicStore.span.get(course.id)
        return rowCount + span
      }
    }, 0)
  })

  const maxRowCount = Math.max(...rowCounts, 1)

  for (const day of days) {
    const mainCourses = mainCoursesList[day]
    const rowCount = rowCounts[day]

    const dummies = [...Array(maxRowCount - rowCount)].map(createDummyCourse)
    mainCourses.push(...dummies)
  }
}

/**
 * Get split courses.
 * @returns A map of positions and courses
 */
export const getCoursesMap = () => {
  const coursePairs = getCoursePairs()
  const positions = getPositions()
  const coursesMap = fromLayout(coursePairs, positions, store.courseLayout)

  insertDummyCourses(coursesMap)
  refreshCoursesMap(coursesMap)

  return coursesMap
}

/**
 * Store a layout of a courses map.
 * @param coursesMap The courses map to be stored
 * @returns
 */
export const storeCoursesMap = (coursesMap: ItemsMap<Course>) => {
  // Store timetable coordinates.
  const timetableCoordinates = new Map<string, TimetableCoordinate>()

  for (const day of days) {
    const mainCourses = coursesMap.get(`main-${day}`) ?? []
    const otherCourses = coursesMap.get(`other-${day}`) ?? []

    let skipCount = 0

    for (let index = 0; index < mainCourses.length; index++) {
      const course = mainCourses[index];
      if (isDummyCourse(course)) {
        continue
      }

      timetableCoordinates.set(course.id, {
        column: day,
        row: index + skipCount,
      })

      const span = dynamicStore.span.get(course.id)
      skipCount += span - 1
    }

    for (const course of otherCourses) {
      timetableCoordinates.set(course.id, {
        column: day,
      })
    }
  }

  store.timetableCoordinates = timetableCoordinates

  // Exclude dummy courses in main courses.
  const filteredCoursesMap = new Map(
    Array.from(coursesMap).map(([position, courses]) => [
      position,
      courses.filter(courses => !isDummyCourse(courses)),
    ])
  )

  const layout = toLayout(filteredCoursesMap)
  store.courseLayout = layout
}
