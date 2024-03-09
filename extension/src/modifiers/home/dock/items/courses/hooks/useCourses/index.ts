import { useEffect, useState } from "react"
import { ItemsMap } from "@/components/sortable/item"
import { Course } from "../../types/course"
import { getDefaultYear } from "@/modifiers/home/config"
import { dynamicStore, store } from "../../store"
import { getCourses } from "./courses"
import { Position } from "../../types/position"
import { fromLayout, toLayout } from "@/modifiers/home/dock/layout"
import { getPeriodKey } from "../../period"

let courses: Course[] = []

export const useCourses = () => {
  if (courses.length === 0) {
    courses = getCourses()
  }

  const [coursesMap, setCoursesMap] = useState<ItemsMap<Course>>(new Map())

  const [year, setYear] = useState(getDefaultYear())
  const [term, setRawTerm] = useState(store.term)

  /**
   * Get where the course should be located at.
   * @param course The course
   * @returns The default position
   */
  const getCourseDefaultPosition = (course: Course): Position => {
    if (course.url === null) {
      return 'trash'
    }

    if (course.year.toString() === year) {
      const period = dynamicStore.period.get(course.id)
      const coordinates = period.get(term)
      if (typeof coordinates === 'undefined') {
        return 'other'
      }
      else if (coordinates.length === 0) {
        return 'current'
      }
      else {
        return 'timetable'
      }
    }

    return 'rest'
  }

  /**
   * Combine positions and courses.
   * @returns An array of tuples of default position and course
   */
  const getCoursePairs = () => {
    const coursePairs = courses.map<[Position, Course]>(course => {
      const position = getCourseDefaultPosition(course)
      return [position, course]
    })

    return coursePairs
  }

  // Restore a layout of a course map.
  useEffect(() => {
    const coursePairs = getCoursePairs()
    const periodKey = getPeriodKey(year, term)
    const layout = dynamicStore.courseLayout.get(periodKey)
    const coursesMap = fromLayout(coursePairs, layout)
    setCoursesMap(coursesMap)
  }, [year, term])

  /**
   * Store a layout of a courses map.
   * @param coursesMap The courses map to be stored
   * @returns
   */
  const storeCoursesMap = (coursesMap: ItemsMap<Course>) => {
    const periodKey = getPeriodKey(year, term)
    const layout = toLayout(coursesMap)
    dynamicStore.courseLayout.set(periodKey, layout)
  }

  const setTerm = (term: string) => {
    setRawTerm(term)
    store.term = term
  }

  return {
    coursesMap,
    setCoursesMap,
    storeCoursesMap,
    year,
    setYear,
    term,
    setTerm,
  }
}
