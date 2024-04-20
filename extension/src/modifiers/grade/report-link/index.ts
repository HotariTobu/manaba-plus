import { c, f, ff } from '@/utils/element'
import { safeFetchDOM } from '@/utils/fetch'
import getDistance from '@/utils/editDistanceOnp'
import { t } from '@/utils/i18n'
import { distanceThreshold, getReportsUrl, selectorMap } from '../config'

type ReportItem = {
  reportUrl: string
  reportTitle: string
}

/**
 * Fetch report urls and their titles and prepare `reportItems`.
 * @returns An array of ReportItem, otherwise null if error on fetching
 */
const getReportItems = async () => {
  const reportsUrl = getReportsUrl(location.href)
  const fetchResult = await safeFetchDOM(reportsUrl)
  if (!fetchResult.success) {
    console.log(fetchResult.message)
    return null
  }

  const reportItems = f<HTMLAnchorElement>(selectorMap.reportAnchor, fetchResult.data)
    .map(anchor => ({
      reportUrl: anchor.href,
      reportTitle: anchor.textContent ?? '',
    }))
  return reportItems
}

/**
 * Find the report item related to the specific grade item.
 * @param gradeTitle The title of the grade item
 * @returns The closest report item from the title
 */
const getReportUrl = (reportItems: ReportItem[], gradeTitle: string) => {
  let nearestReportURL: string | null = null
  let minDistance = 1

  for (const { reportUrl, reportTitle } of reportItems) {
    const distance = getDistance(reportTitle, gradeTitle)
    if (minDistance > distance) {
      nearestReportURL = reportUrl
      minDistance = distance
    }
  }

  if (minDistance > distanceThreshold) {
    nearestReportURL = null
  }

  if (nearestReportURL === null) {
    return null
  } else {
    return nearestReportURL
  }
}

/**
 * Insert a link from a grade to the assignment.
 * Determine if the grade is related to the assignment with the string distance.
 */
const insertReportLink = async () => {
  const reportItems = await getReportItems()
  if (reportItems === null) {
    return
  }

  f(selectorMap.gradeRow).forEach((row, index) => {
    if (index % 2 === 1) {
      return
    }

    // Get the linked report url.
    const gradeTitle = ff(selectorMap.gradeTitle, row)?.textContent
    if (typeof gradeTitle === 'undefined' || gradeTitle === null) {
      return
    }

    const gradeCell = ff(selectorMap.gradeCell, row)
    if (gradeCell === null || gradeCell.children.length > 0) {
      return
    }

    const reportUrl = getReportUrl(reportItems, gradeTitle)
    if (reportUrl === null) {
      return
    }

    // Create anchors.
    gradeCell.appendChild(c('br'))

    const reportAnchor = c('a', {
      href: reportUrl,
      textContent: t('grade_view_answer'),
    })
    gradeCell.appendChild(reportAnchor)
  })
}

// Entry point
export default async () => {
  await insertReportLink()
}
