import { Course } from "../types/course"

/**
 * Create a dummy course
 * @returns A dummy course object
 */
export const createDummyCourse = (): Course & {
  dummy: boolean
} => ({
  id: crypto.randomUUID(),

  title: '',

  year: 0,

  linked: false,
  status: {},

  dummy: true,
})

/**
 * Determine if a course is a dummy.
 * @param course The course object
 * @returns True if the course is dummy, otherwise false
 */
export const isDummyCourse = (course: Course) => {
  return 'dummy' in course
}
