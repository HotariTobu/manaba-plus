import { useEffect, useState } from "react"
import { ItemsMap } from "@/components/sortable/item"
import { Course } from "../../types/course"
import { getDefaultYear } from "@/modifiers/home/config"
import { dynamicStore, store } from "../../store"
import { getCourses } from "./courses"
import { Position } from "../../types/position"
import { itemsMapFromLayout, itemsMapToLayout } from "@/modifiers/home/dock/layout"
import { getPeriodKey } from "../../period"

let courses: Course[] | null = null

const getMemorizedCourses = () => {
  if (courses === null) {
    courses = getCourses()
    return courses
  }
  else {
    return courses
  }
}

export const useCourses = () => {
  const courses = getMemorizedCourses()

  const [coursesMap, setCoursesMap] = useState<ItemsMap<Course>>(new Map())

  const [year, setYear] = useState(getDefaultYear())
  const [term, setRawTerm] = useState(store.term)
  const periodKey = getPeriodKey(year, term)

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

  // Restore a layout of a course map.
  useEffect(() => {
    const coursePairs = courses.map<[Position, Course]>(course => {
      const position = getCourseDefaultPosition(course)
      return [position, course]
    })

    const layout = dynamicStore.courseLayout.get(periodKey)

    const coursesMap = itemsMapFromLayout(coursePairs, layout)
    setCoursesMap(coursesMap)
  }, [periodKey])

  /**
   * Store a layout of a courses map.
   * @param coursesMap The courses map to be stored
   * @returns
   */
  const storeCoursesMap = (coursesMap: ItemsMap<Course>) => {
    const layout = itemsMapToLayout(coursesMap)
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
