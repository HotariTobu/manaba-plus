import { f, ff } from "@/utils/element"
import { Course } from "../types/course"
import { getFiscalYear } from "../../../../config"

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

const createCourse = (props: Omit<Course, 'id'>) => {
  return {
    id: props.url ?? props.icon ?? props.title,
    ...props
  }
}

const statusRegex = /.+on\.\w+$/

const getStatus = (element: Element) => {
  return Object.fromEntries(
    f<HTMLImageElement>(':is(.course-card-status, .coursestatus) img', element)
      .map((a, i) => [i, statusRegex.test(a.src)])
  )
}

const getThumbnailCourse = (element: Element): Course => {
  const a = createAttributeGetter(element)
  return createCourse({
    url: a('.course-card-title a', 'href'),
    code: a('.coursecode'),
    icon: a('.course-card-img img', 'src'),
    title: a('.course-card-title a') ?? '',

    year: parseInt(ff('.courseitemdetail:first-of-type', element)?.firstChild?.textContent ?? ''),
    day: null,
    period: null,

    linked: a('.courselink-state') !== null,
    remarks: a('.courseitemdetail:first-of-type span'),
    teachers: a('.courseitemdetail:last-of-type'),
    status: getStatus(element),
  })
}

const getListCourse = (element: HTMLTableRowElement): Course => {
  const a = createAttributeGetter(element)
  return createCourse({
    url: a('.courselist-title a', 'href'),
    code: null,
    icon: a('img.inline', 'src'),
    title: a('.courselist-title') ?? '',

    year: parseInt(a('td:nth-of-type(2)') ?? ''),
    day: null,
    period: null,

    linked: a('span[style]') !== null,
    remarks: a('td:nth-of-type(3)'),
    teachers: a('td:nth-of-type(4)'),
    status: getStatus(element),
  })
}

const getTimetableCourse = (element: HTMLTableCellElement): Course => {
  const a = createAttributeGetter(element)
  return createCourse({
    url: a('a:first-of-type', 'href'),
    code: null,
    icon: null,
    title: a('a:first-of-type') ?? '',

    year: parseInt(a('.my-infolist-mycourses select:nth-child(2)', 'value')?.match(/\d{4}/)?.[0] ?? getFiscalYear().toString()),
    day: element.cellIndex - 1,
    period: {
      start: parseInt(element.parentElement?.firstElementChild?.textContent ?? ''),
      span: element.rowSpan,
    },

    linked: a('.registration-state') !== null,
    remarks: null,
    teachers: null,
    status: getStatus(element),
  })
}

const getCourses = () => {
  return [
    ...f('.coursecard').map(getThumbnailCourse),
    ...f<HTMLTableRowElement>('.courselist tr:not([class*="title"])').map(getListCourse),
    ...f<HTMLTableCellElement>('.course-cell').map(getTimetableCourse),
  ]
}

export const useCourses = () => {
  const courses = getCourses()
  console.log(courses)
}
