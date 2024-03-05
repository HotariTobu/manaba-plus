import { f, ff } from "@/utils/element"
import { getFiscalYear, selectorMap, statusRegex } from "../../../../../config"
import { Course, DayOfWeek } from "../../types/course"
import { TimetableCoordinate } from "../../types/timetableCoordinate"
import { dynamicStore, store } from "../../store"

/**
 * Create a function to get attribute values of descendants of the specific element.
 * @param element The target element
 * @returns A function to get attributes
 */
const createAttributeGetter = (element: Element) => {
  return (selector: string, attributeName = 'textContent') => {
    const source = ff(selector, element)
    if (source === null) {
      return
    }

    const attribute = source[attributeName as keyof Element]
    if (typeof attribute === 'string') {
      return attribute.trim()
    }

    return
  }
}

/**
 * Complete a course object by determining the course's id.
 * @param props Course properties excluded id
 * @param rect The course's timetable coordinate and span
 * @returns A course object with id properties
 */
const createCourse = (props: Omit<Course, 'id'>, rect?: {
  day: DayOfWeek
  periodStart?: number
  periodSpan: number
}) => {
  const id = props.url ?? props.icon ?? props.title

  if (typeof rect !== 'undefined') {
    if (!store.timetableCoordinates.has(id)) {
      const coordinate: TimetableCoordinate = {
        column: rect.day
      }

      if (typeof rect.periodStart !== 'undefined') {
        coordinate.row = rect.periodStart - 1
      }

      store.timetableCoordinates.set(id, coordinate)
    }

    if (!dynamicStore.span.has(id)) {
      const span = rect.periodSpan
      dynamicStore.span.set(id, span)
    }
  }

  return {
    id,
    ...props
  }
}

/**
 * Convert an optional string into an optional number.
 * @param text The text
 * @returns A number if the text is a valid number string, otherwise undefined
 */
const toOptionalInt = (text: string | null | undefined) => {
  if (text === null || typeof text === 'undefined') {
    return
  }

  const number = parseInt(text)
  if (isNaN(number)) {
    return
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
      .map((a, i) => [i, statusRegex.test(a.src)])
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

    year: toOptionalInt(ff(selectorMap.courses.thumbnail.year, element)?.firstChild?.textContent),

    linked: typeof a(selectorMap.courses.thumbnail.linked) === 'string',
    remarks: a(selectorMap.courses.thumbnail.remarks),
    teachers: a(selectorMap.courses.thumbnail.teachers),
    status: getStatus(element),
  })
}

/**
 * Get course info from a list row formatted container element.
 * @param element The container element
 * @returns A course object
 */
const getListCourse = (element: HTMLTableRowElement): Course => {
  const a = createAttributeGetter(element)
  return createCourse({
    url: a(selectorMap.courses.list.url, 'href'),
    icon: a(selectorMap.courses.list.icon, 'src'),
    title: a(selectorMap.courses.list.title) ?? '',

    year: toOptionalInt(a(selectorMap.courses.list.year)),

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
const getTimetableCourse = (element: HTMLTableCellElement): Course => {
  const year = toOptionalInt(ff<HTMLSelectElement>(selectorMap.courses.timetable.year)?.value?.match(/\d{4}/)?.[0]) ?? getFiscalYear()

  const a = createAttributeGetter(element)
  return createCourse({
    url: a(selectorMap.courses.timetable.url, 'href'),
    title: a(selectorMap.courses.timetable.title) ?? '',

    year,

    linked: typeof a(selectorMap.courses.timetable.linked) === 'string',
    status: getStatus(element),
  }, {
    day: element.cellIndex,
    periodStart: toOptionalInt(element.parentElement?.firstElementChild?.textContent),
    periodSpan: element.rowSpan,
  })
}

/**
 * Get course info from all container elements.
 * @returns An array of course objects
 */
export const getCourses = () => {
  return [
    ...f(selectorMap.courses.thumbnail.source).map(getThumbnailCourse),
    ...f<HTMLTableRowElement>(selectorMap.courses.list.source).map(getListCourse),
    ...f<HTMLTableCellElement>(selectorMap.courses.timetable.source).map(getTimetableCourse),
  ]
}
