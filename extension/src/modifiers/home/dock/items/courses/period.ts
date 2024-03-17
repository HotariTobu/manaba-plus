import { coordinateToNumber } from "./types/coordinate"
import { Period } from "./types/period"

type PeriodGetter = (remarks: string) => Period | null

const periodGetters: Record<string, (() => PeriodGetter) | undefined> = {
  "room.chuo-u.ac.jp": () => {
    const joinWords = (obj: object) => {
      const keys = Object.keys(obj)
      const values = Object.values(obj)
      const words = keys.concat(values)
      return `(${words.join('|')})`
    }

    const terms: Record<string, string> = {
      '前': 'fir',
      '後': 'sec',
      '通': 'ful',
    }
    const days: Record<string, number> = {
      '月': 0,
      '火': 1,
      '水': 2,
      '木': 3,
      '金': 4,
      '土': 5,
      '日': 6,
      'mon': 0,
      'tue': 1,
      'wed': 2,
      'thu': 3,
      'fri': 4,
      'sat': 5,
      'sun': 6,
    }
    const dayGroup = `(${Object.keys(days).join('|')})`

    const termRegex = new RegExp(joinWords(terms), 'i')
    const periodRegex = new RegExp(`${dayGroup}.*?(\\d+)`, 'ig')

    return (remarks: string) => {
      const termMatch = termRegex.exec(remarks)
      if (termMatch === null) {
        return null
      }
      const periodMatches = Array.from(remarks.matchAll(periodRegex))

      const rawTerm = termMatch[1].toLowerCase()
      const term = terms[rawTerm] ?? rawTerm

      const coordinates = periodMatches.map(periodMatch => {
        const rawDay = periodMatch[1].toLowerCase()
        const column = days[rawDay]
        const row = parseInt(periodMatch[2]) - 1
        return {
          column,
          row,
        }
      })

      const termList = term === 'ful' ? ['fir', 'sec'] : [term]
      const period: Period = new Map()

      for (const term of termList) {
        period.set(term, coordinates.map(coordinateToNumber))
      }

      return period
    }
  }
}

const { hostname } = location

export const getPeriod = (periodGetters[hostname] ?? (() => () => null))()

export const getPeriodKey = (year: string | number, term: string) => {
  return `${year}-${term}`
}
