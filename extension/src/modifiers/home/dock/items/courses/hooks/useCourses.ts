import { f, ff } from "@/utils/element"
import { Course } from "../types/course"
import { getFiscalYear, selectorMap } from "../../../../config"

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

const createCourse = (props: Omit<Course, 'id'>) => {
  return {
    id: props.url ?? props.icon ?? props.title,
    ...props
  }
}

const statusRegex = /.+on\.\w+$/

const getStatus = (element: Element) => {
  return Object.fromEntries(
    f<HTMLImageElement>(selectorMap.courses.status, element)
      .map((a, i) => [i, statusRegex.test(a.src)])
  )
}

const getThumbnailCourse = (element: Element): Course => {
  const a = createAttributeGetter(element)
  return createCourse({
    url: a(selectorMap.courses.thumbnail.url, 'href'),
    code: a(selectorMap.courses.thumbnail.code),
    icon: a(selectorMap.courses.thumbnail.icon, 'src'),
    title: a(selectorMap.courses.thumbnail.title) ?? '',

    year: parseInt(ff(selectorMap.courses.thumbnail.year, element)?.firstChild?.textContent ?? ''),

    linked: typeof a(selectorMap.courses.thumbnail.linked) === 'string',
    remarks: a(selectorMap.courses.thumbnail.remarks),
    teachers: a(selectorMap.courses.thumbnail.teachers),
    status: getStatus(element),
  })
}

const getListCourse = (element: HTMLTableRowElement): Course => {
  const a = createAttributeGetter(element)
  return createCourse({
    url: a(selectorMap.courses.list.url, 'href'),
    icon: a(selectorMap.courses.list.icon, 'src'),
    title: a(selectorMap.courses.list.title) ?? '',

    year: parseInt(a(selectorMap.courses.list.year) ?? ''),

    linked: typeof a(selectorMap.courses.list.linked) === 'string',
    remarks: a(selectorMap.courses.list.remarks),
    teachers: a(selectorMap.courses.list.teachers),
    status: getStatus(element),
  })
}

const getTimetableCourse = (element: HTMLTableCellElement): Course => {
  const year = parseInt(ff<HTMLSelectElement>(selectorMap.courses.timetable.year)?.value?.match(/\d{4}/)?.[0] ?? getFiscalYear().toString())

  const a = createAttributeGetter(element)
  return createCourse({
    url: a(selectorMap.courses.timetable.url, 'href'),
    title: a(selectorMap.courses.timetable.title) ?? '',

    year,
    day: element.cellIndex - 1,
    period: {
      start: parseInt(element.parentElement?.firstElementChild?.textContent ?? ''),
      span: element.rowSpan,
    },

    linked: typeof a(selectorMap.courses.timetable.linked) === 'string',
    status: getStatus(element),
  })
}

const getCourses = () => {
  return [
    ...f(selectorMap.courses.thumbnail.source).map(getThumbnailCourse),
    ...f<HTMLTableRowElement>(selectorMap.courses.list.source).map(getListCourse),
    ...f<HTMLTableCellElement>(selectorMap.courses.timetable.source).map(getTimetableCourse),
  ]
}

export const useCourses = () => {
  const courses = getCourses()
  console.log(courses)
  return courses
}
