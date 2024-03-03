import { ItemsMap } from "@/components/sortable/item"
import { Layout } from "../../types/layout"
import { fromLayout, toLayout } from "../../layout"
import { Course, DayOfWeek } from "./types/course"

export const isDummyCourse = (course: Course) => {
  return 'dummy' in course
}

export const fromCourseLayout = (coursePairs: [string, Course][], positions: string[], layout: Layout) => {
  const coursesMap = fromLayout(coursePairs, positions, layout)

  // Insert dummy courses into main courses for the timetable format.
  const mainCourses = coursesMap.get('main') ?? []
  for (const course of mainCourses.splice(0)) {
    const { day, period } = course
    if (typeof day === 'undefined' || typeof period === 'undefined') {
      continue
    }

    const row = period.start - 1
    const column = day

    const index = row * DayOfWeek.Count + column

    const lack = index - mainCourses.length
    if (lack >= 0) {
      const dummyCourses = [...Array(lack + 1)].map<Course>(() => ({
        id: crypto.randomUUID(),
        title: '',
        year: 0,
        linked: false,
        status: {},
        dummy: true,
      }))
      mainCourses.push(...dummyCourses)
    }

    mainCourses[index] = course
  }

  return coursesMap
}

export const toCourseLayout = (coursesMap: ItemsMap<Course>) => {
  // Exclude dummy courses in main courses.
  const mainCourses = coursesMap.get('main') ?? []
  coursesMap.set('main', mainCourses.filter(
    course => !isDummyCourse(course)
  ))

  return toLayout(coursesMap)
}
