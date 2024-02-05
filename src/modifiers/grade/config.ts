import { defineSelectorMap } from "@/types/config"

export const selectorMap = defineSelectorMap({
  reportAnchor: '.report-title a',
  gradeRow: 'tr[class*="row"]',
  gradeTitle: '.grade-title',
  gradeCell: '.grade',
})

// If distance between a grade title and a report one is less than or equal the threshold, link the grade and report.
export const distanceThreshold = 0.6

/**
 * Convert a grade url into a report url that is in the same course.
 * @param gradesUrl The url of grade page
 * @returns The url of report page
 */
export const getReportsUrl = (gradesUrl: string) => {
  return gradesUrl.replace(/_grade$/, '_report')
}
