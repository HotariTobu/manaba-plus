import { ItemsMap } from "@/components/sortable/item"
import { fromLayout, toLayout } from "../../../../layout"
import { dynamicStore, store } from "../../store"
import { Course } from "../../types/course"
import { Position, positions } from "../../types/position"
import { getCourses } from "./courses"

/**
 * Get where the course should be located at.
 * @param course The course
 * @returns The default position
 */
export const getCourseDefaultPosition = (course: Course): Position => {
  const rect = dynamicStore.rect.get(course.id)
  if (rect === null) {
    if (course.url === null) {
      return 'trash'
    }

    return 'rest'
  }
  else {
    if (rect.row === null) {
      return 'other'
    }

    return 'main'
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
 * Get split courses.
 * @returns A map of positions and courses
 */
export const getCoursesMap = () => {
  const coursePairs = getCoursePairs()
  const coursesMap = fromLayout(coursePairs, positions, store.courseLayout)
  return coursesMap
}

/**
 * Store a layout of a courses map.
 * @param coursesMap The courses map to be stored
 * @returns
 */
export const storeCoursesMap = (coursesMap: ItemsMap<Course>) => {
  const layout = toLayout(coursesMap)
  store.courseLayout = layout
}
