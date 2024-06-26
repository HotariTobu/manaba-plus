import { f, ff } from "@/utils/element"
import { getFiscalYear, selectorMap, statusRegex } from "../../../../../config"
import { Course, statusTypes } from "../../types/course"
import { dynamicStore, getYearModuleKey, localStore, store } from "../../store"
import { Period, getPeriods } from "../../period"
import { t } from "@/utils/i18n"
import { CoordinatesMap } from "../../types/coordinate"

/**
 * Create a function to get attribute values of descendants of the specific element.
 * @param element The target element
 * @returns A function to get attributes
 */
const createAttributeGetter = (element: Element) => {
  return (selector: string, attributeName = 'textContent') => {
    const source = ff(selector, element)
    if (source === null) {
      return null
    }

    const attribute = source[attributeName as keyof Element]
    if (typeof attribute === 'string') {
      return attribute.trim()
    }

    return null
  }
}

/**
 * Complete a course object by determining the course's id.
 * @param props Course properties excluded id
 * @returns A course object with id properties
 */
const createCourse = (props: Omit<Course, 'id'>) => {
  const id = props.url ?? props.icon ?? props.title
  return {
    id,
    ...props
  }
}

/**
 * Convert an optional string into an nullable number.
 * @param text The text
 * @returns A number if the text is a valid number string, otherwise null
 */
const toNullableInt = (text: string | null | undefined) => {
  if (text === null || typeof text === 'undefined') {
    return null
  }

  const number = parseInt(text)
  if (isNaN(number)) {
    return null
  }
  else {
    return number
  }
}

/**
 * Get a course status
 * @param element The target element
 * @returns A course's status object
 */
const getStatus = (element: Element) => {
  return Object.fromEntries(
    f<HTMLImageElement>(selectorMap.courses.status, element)
      .map((a, i) => [statusTypes[i], statusRegex.test(a.src)])
  )
}

/**
 * Get course info from a thumbnail formatted container element.
 * @param element The container element
 * @returns A course object
 */
const getThumbnailCourse = (element: Element): Course => {
  const a = createAttributeGetter(element)
  return createCourse({
    url: a(selectorMap.courses.thumbnail.url, 'href'),
    code: a(selectorMap.courses.thumbnail.code),
    icon: a(selectorMap.courses.thumbnail.icon, 'src'),
    title: a(selectorMap.courses.thumbnail.title) ?? '',

    year: toNullableInt(ff(selectorMap.courses.thumbnail.year, element)?.firstChild?.textContent) ?? getFiscalYear(),

    linked: typeof a(selectorMap.courses.thumbnail.linked) === 'string',
    remarks: a(selectorMap.courses.thumbnail.remarks)?.replace(/\d{4}/, '') ?? null,
    teachers: a(selectorMap.courses.thumbnail.teachers),
    status: getStatus(element),
  })
}

/**
 * Get course info from a list row formatted container element.
 * @param element The container element
 * @returns A course object
 */
const getListCourse = (element: Element): Course => {
  const a = createAttributeGetter(element)
  return createCourse({
    url: a(selectorMap.courses.list.url, 'href'),
    code: null,
    icon: a(selectorMap.courses.list.icon, 'src'),
    title: a(selectorMap.courses.list.title) ?? '',

    year: toNullableInt(a(selectorMap.courses.list.year)) ?? getFiscalYear(),

    linked: typeof a(selectorMap.courses.list.linked) === 'string',
    remarks: a(selectorMap.courses.list.remarks),
    teachers: a(selectorMap.courses.list.teachers),
    status: getStatus(element),
  })
}

/**
 * Get course info from a timetable cell formatted container element.
 * @param element The container element
 * @returns A course object
 */
const getTimetableCourse = (element: Element): Course => {
  const year = toNullableInt(ff<HTMLSelectElement>(selectorMap.courses.timetable.year)?.value?.match(/\d{4}/)?.[0]) ?? getFiscalYear()

  const a = createAttributeGetter(element)
  return createCourse({
    url: a(selectorMap.courses.timetable.url, 'href'),
    code: null,
    icon: null,
    title: a(selectorMap.courses.timetable.title) ?? '',

    year,

    linked: typeof a(selectorMap.courses.timetable.linked) === 'string',
    remarks: null,
    teachers: null,
    status: getStatus(element),
  })
}

/** Period data extended with course data */
type PeriodInfo = {
  courseId: string,
  year: number,
} & Period

/**
 * Get period info list of a course.
 * Period info includes the course id, the year, the class module, and the timetable coordinates.
 * @param course The course object
 * @returns An array of period info
 */
const getPeriodInfoList = (course: Course) => {
  const { id, year, remarks } = course
  if (remarks === null) {
    return null
  }

  const periods = getPeriods(remarks)
  if (periods === null) {
    return null
  }

  const periodInfoList: PeriodInfo[] = []

  for (const period of periods) {
    periodInfoList.push({
      courseId: id,
      year,
      ...period,
    })
  }

  return periodInfoList
}

/**
 * Add new years to the course years store.
 * @param courses The course object
 */
const initializeYears = (courses: Course[]) => {
  const newYears = new Set(store.years)

  for (const course of courses) {
    newYears.add(course.year)
  }

  const sorted = Array.from(newYears).sort()
  sorted.push(getFiscalYear())

  store.years = new Set(sorted)
}

/**
 * Add new modules to the course modules store.
 * @param modules The set of all modules
 */
const initializeModules = (modules: Set<string>) => {
  const sorted = Array.from(modules).sort()
  if (sorted.length === 0) {
    sorted.push('default')
  }

  const newModules = new Map(store.modules.map(
    ({ id, label }) => [id, label]
  ))

  for (const module of sorted) {
    if (newModules.has(module)) {
      continue
    }

    const label = t(`home_courses_module_${module}`)
    if (label === '') {
      newModules.set(module, module)
    }
    else {
      newModules.set(module, label)
    }
  }

  if (!newModules.has(store.module)) {
    const newModule = newModules.keys().next().value
    if (typeof newModule === 'string') {
      store.module = newModule
    }
  }

  store.modules = Array.from(newModules).map(
    ([id, label]) => ({ id, label })
  )
}

/**
 * Update the course store.
 * @param courses The array of course objects
 */
const initializeStore = (courses: Course[]) => {
  const periodInfoList = courses.flatMap(getPeriodInfoList)

  const modules = new Set<string>()

  // Separate updating timetable coordinates maps into 2 steps to reduce writing access to the storage.

  // Step 1: Get coordinates maps merged of the existing and the new.
  const newCoordinatesMapMap = new Map<string, CoordinatesMap>()

  for (const info of periodInfoList) {
    if (info === null) {
      continue
    }

    const { courseId, year, module, coordinates } = info
    modules.add(module)

    const yearModuleKey = getYearModuleKey(year, module)

    const coordinatesMap = newCoordinatesMapMap.get(yearModuleKey)
    if (typeof coordinatesMap === 'undefined') {
      newCoordinatesMapMap.set(yearModuleKey, new Map([
        [courseId, coordinates],
      ]))
    }
    else {
      coordinatesMap.set(courseId, coordinates)
      newCoordinatesMapMap.set(yearModuleKey, coordinatesMap)
    }
  }

  // Step 2: Apply the new coordinates maps to the store.
  for (const [yearModuleKey, newCoordinatesMap] of newCoordinatesMapMap) {
    const coordinatesMap = dynamicStore.coordinatesMap.get(yearModuleKey)

    for (const [courseId, coordinates] of newCoordinatesMap) {
      if (coordinatesMap.has(courseId)) {
        continue
      }

      coordinatesMap.set(courseId, coordinates)
    }

    dynamicStore.coordinatesMap.set(yearModuleKey, coordinatesMap)
  }

  localStore.courses = courses
  initializeYears(courses)
  initializeModules(modules)
}

/**
 * Get course info from all container elements.
 * @returns An array of course objects
 */
export const getCourses = () => {
  const courses = [
    ...f(selectorMap.courses.thumbnail.source).map(getThumbnailCourse),
    ...f(selectorMap.courses.list.source).map(getListCourse),
    ...f(selectorMap.courses.timetable.source).map(getTimetableCourse),
  ]

  initializeStore(courses)

  return courses
}
