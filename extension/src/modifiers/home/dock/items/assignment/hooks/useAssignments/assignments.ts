import { unsafeFetchDOM } from '@/utils/fetch'
import { Assignment } from '../../types/assignment'
import { allAssignmentsPath, dateTimeRegex, selectorMap } from "../../../../../config"
import { f, ff } from '@/utils/element'
import { o } from '@/store'

/**
 * Create a function to get anchor elements of descendants of the specific element.
 * @param element The target element
 * @returns A function to get anchors
 */
const createAnchorGetter = (element: Element) => {
  return (selector: string) => ff<HTMLAnchorElement>(selector, element)
}

/**
 * Complete a assignment object by determining the assignment's id.
 * @param props Assignment properties excluded id
 * @returns A assignment object with id properties
 */
const createAssignment = (props: Omit<Assignment, 'id'>) => {
  return {
    id: props.url,
    ...props
  }
}

/**
 * Get a Date object from string.
 * @param str The string that includes date-time
 * @returns The Date object
 */
const parseDateTime = function (str: string | null | undefined) {
  if (str === null || typeof str === 'undefined') {
    return null
  }

  const match = dateTimeRegex.exec(str)
  if (match === null) {
    return null
  }

  const [year, month, date, hours, minutes] = match
    .slice(1)
    .map((value) => parseInt(value))
  return new Date(year, month - 1, date, hours, minutes)
}

/**
 * Extract assignments from a document.
 * @param doc The DOM document
 * @returns Assignment objects
 */
const getRowAssignment = (element: Element): Assignment | null => {
  const a = createAnchorGetter(element)

  const assignmentAnchor = a(selectorMap.assignments.assignment)
  if (assignmentAnchor === null) {
    return null
  }

  const typeAnchor = a(selectorMap.assignments.type)
  const courseAnchor = a(selectorMap.assignments.course)

  return createAssignment({
    url: assignmentAnchor.href,
    title: assignmentAnchor.textContent ?? '',
    deadline: parseDateTime(ff(selectorMap.assignments.deadline, element)?.textContent),

    type: typeAnchor && {
      url: typeAnchor.href,
      label: typeAnchor.textContent ?? '',
    },
    course: courseAnchor && {
      url: courseAnchor.href,
      title: courseAnchor.textContent ?? '',
    },
  })
}

/**
 * Get all assignment info from scraping.
 * @returns An array of assignment objects
 */
export const getAssignments = async () => {
  const rootUrl = o.rootUrl
  if (rootUrl === '') {
    throw new Error('Reload the top page of manaba.')
  }
  const url = rootUrl + allAssignmentsPath

  const doc = await unsafeFetchDOM(url)

  const assignments: Assignment[] = []

  const rows = f(selectorMap.assignments.row, doc)
  for (const row of rows) {
    const assignment = getRowAssignment(row)
    if (assignment === null) {
      continue
    }

    assignments.push(assignment)
  }

  // Inject dummy data in debugging.
  debug: {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const date = now.getDate()
    const hours = now.getHours()
    const minutes = now.getMinutes()

    assignments.push({
      id: crypto.randomUUID(),
      url: "",
      title: "過ぎてしまった課題",
      deadline: new Date(year, month, date, hours - 1, minutes),
      type: {
        url: '',
        label: 'エスパー',
      },
      course: {
        url: '',
        title: "コースの1つ",
      },
    }, {
      id: crypto.randomUUID(),
      url: "",
      title: "めっちゃやばい課題",
      deadline: new Date(year, month, date, hours + 1, minutes),
      type: {
        url: '',
        label: 'ほのお',
      },
      course: {
        url: '',
        title: "何らかのコース",
      },
    }, {
      id: crypto.randomUUID(),
      url: "",
      title: "ちょっと焦る課題",
      deadline: new Date(year, month, date + 2, hours, minutes),
      type: {
        url: '',
        label: 'でんき',
      },
      course: {
        url: '',
        title: "あるコース"
      },
    }, {
      id: crypto.randomUUID(),
      url: "",
      title: "まだ余裕がある課題",
      deadline: new Date(year, month, date + 5, hours, minutes),
      type: {
        url: '',
        label: 'くさ',
      },
      course: {
        url: '',
        title: "どうでもいいコース"
      },
    })
  }

  return assignments
}
