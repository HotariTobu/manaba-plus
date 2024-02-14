import { c, f, ff } from '@/utils/element'
import { fetchDOM } from '@/utils/fetch'
import getDistance from '@/utils/editDistanceOnp'
import { t } from '@/utils/i18n'
import { distanceThreshold, getReportsUrl, selectorMap } from '../config'

interface ReportItem {
  reportUrl: string
  reportTitle: string
}

let reportItems: ReportItem[] | null = null

/**
 * Fetch report urls and their titles and prepare `reportItems`.
 */
const initReportItems = async () => {
  const reportsUrl = getReportsUrl(location.href)
  const fetchResult = await fetchDOM(reportsUrl)
  if ('message' in fetchResult) {
    return
  }

  reportItems = f<HTMLAnchorElement>(selectorMap.reportAnchor, fetchResult.data)
    .map(anchor => {
      const reportUrl = anchor.href
      const reportTitle = anchor.textContent ?? ''
      return { reportUrl, reportTitle }
    })
}

/**
 * Find the report item related to the specific grade item.
 * @param gradeTitle The title of the grade item
 * @returns The closest report item from the title
 */
const getReportUrl = function (gradeTitle: string) {
  if (reportItems === null) {
    return null
  }

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
const insertReportLink = async function () {
  await initReportItems()

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

    const reportUrl = getReportUrl(gradeTitle)
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
