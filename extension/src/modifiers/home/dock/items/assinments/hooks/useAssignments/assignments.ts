import { fetchDOM } from '@/utils/fetch'
import { Assignment } from '../../types/assignment'
import { allAssignmentsPath, dateTimeRegex, selectorMap } from "../../../../../config"
import { f, ff } from '@/utils/element'
import { o } from '@/stores/options'

/**
 * Create a function to get anchor elements of descendants of the specific element.
 * @param element The target element
 * @returns A function to get anchors
 */
const createAnchorGetter = (element: Element) => {
  return (selector: string) => ff<HTMLAnchorElement>(selector, element)
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

  return {
    id: assignmentAnchor.href,

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
  }
}

/**
 * Get all assignment info from scraping.
 * @returns An array of assignment objects
 */
export const getAssignments = async () => {
  const rootUrl = o.common.rootUrl.value
  const url = rootUrl + allAssignmentsPath

  const fetchResult = await fetchDOM(url)
  if ('message' in fetchResult) {
    throw new Error(fetchResult.message)
  }

  const doc = fetchResult.data

  const assignments = []

  const rows = f(selectorMap.assignments.row, doc)
  for (const row of rows) {
    const assignment = getRowAssignment(row)
    if (assignment === null) {
      continue
    }

    assignments.push(assignment)
  }

  console.log(assignments)
  await new Promise<void>(r => setTimeout(r, 500))

  return assignments
}
