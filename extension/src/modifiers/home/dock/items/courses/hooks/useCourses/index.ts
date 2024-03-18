import { useEffect, useState } from "react"
import { ItemsMap } from "@/components/sortable/item"
import { Course } from "../../types/course"
import { getFiscalYear } from "@/modifiers/home/config"
import { dynamicStore, getYearTermKey, store } from "../../store"
import { getCourses } from "./courses"
import { Position } from "../../types/position"
import { itemsMapFromLayout, itemsMapToLayout } from "@/modifiers/home/dock/layout"
import { CoordinatesMap } from "../../types/coordinate"

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


/**
 * Get where the course should be located at.
 * @param course The course
 * @returns The default position
 */
const createCourseDefaultPositionGetter = (year: number, coordinatesMap: CoordinatesMap) => {
  return (course: Course): Position => {
    if (course.url === null) {
      return 'trash'
    }

    if (course.year === year) {
      const coordinates = coordinatesMap.get(course.id)
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
}

export const useCourses = () => {
  const courses = getMemorizedCourses()

  const [coursesMap, setCoursesMap] = useState<ItemsMap<Course>>(new Map())

  const [year, setYear] = useState(getFiscalYear())
  const [term, internalSetTerm] = useState(store.term)
  const yearTermKey = getYearTermKey(year, term)

  // Restore a layout of a course map.
  useEffect(() => {
    const coordinatesMap = dynamicStore.coordinatesMap.get(yearTermKey)
    const getCourseDefaultPosition = createCourseDefaultPositionGetter(year, coordinatesMap)
    const coursePairs = courses.map<[Position, Course]>(course => {
      const position = getCourseDefaultPosition(course)
      return [position, course]
    })

    const layout = dynamicStore.coursesLayout.get(yearTermKey)

    const coursesMap = itemsMapFromLayout(coursePairs, layout)
    setCoursesMap(coursesMap)
  }, [yearTermKey])

  /**
   * Store a layout of a courses map.
   * @param coursesMap The courses map to be stored
   * @returns
   */
  const storeCoursesMap = (coursesMap: ItemsMap<Course>) => {
    const layout = itemsMapToLayout(coursesMap)
    dynamicStore.coursesLayout.set(yearTermKey, layout)
  }

  const setTerm = (term: string) => {
    internalSetTerm(term)
    store.term = term
  }

  return {
    coursesMap,
    setCoursesMap,
    storeCoursesMap,
    selectProps: {
      year,
      setYear,
      term,
      setTerm,
    },
    yearTermKey,
  }
}
