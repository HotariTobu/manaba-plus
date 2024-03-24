import { coordinateToNumber } from "./types/coordinate"

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
} as const
const dayGroup = `(${Object.keys(days).join('|')})`

/**
 * Join words with `|` and create a regex string.
 * @example
 * const obj = {
 *   a: 1,
 *   b: 2,
 * }
 * joinWords(obj)
 * // '(a|b|1|2)'
 * @param obj The object that has keywords as properties
 * @returns A string joined with the object properties
 */
const joinWords = (obj: object) => {
  const keys = Object.keys(obj)
  const values = Object.values(obj)
  const words = keys.concat(values)
  return `(${words.join('|')})`
}

export interface Period {
  term: string
  coordinates: number[]
}

type PeriodsGetter = (remarks: string) => Period[] | null

const periodsGetters: Record<string, (() => PeriodsGetter) | undefined> = {
  "room.chuo-u.ac.jp": () => {
    const terms: Record<string, string> = {
      '前': 'fir',
      '後': 'sec',
      '通': 'ful',
    }

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
        return coordinateToNumber({
          column,
          row,
        })
      })

      const termList = term === 'ful' ? ['fir', 'sec'] : [term]
      const periods: Period[] = []

      for (const term of termList) {
        periods.push({
          term,
          coordinates,
        })
      }

      return periods
    }
  },
  "manaba.tsukuba.ac.jp": () => {
    const terms: Record<string, string> = {
      '春': 'spr',
      '秋': 'aut',
    }

    const termRegex = new RegExp(`${joinWords(terms)}.*?([A-C]{1,})`, 'ig')
    const periodRegex = new RegExp(`${dayGroup}.*?([\\d,]+)`, 'ig')

    return (remarks: string) => {
      const termMatches = Array.from(remarks.matchAll(termRegex))
      const periodMatches = Array.from(remarks.matchAll(periodRegex))

      const termList = termMatches.flatMap(termMatch => {
        const rawTerm = termMatch[1].toLowerCase()
        const term = terms[rawTerm] ?? rawTerm
        return Array.from(termMatch[2]).map(
          subTerm => `${term}-${subTerm}`
        )
      })

      const coordinates = periodMatches.flatMap(periodMatch => {
        const rawDay = periodMatch[1].toLowerCase()
        const column = days[rawDay]
        return periodMatch[2].split(',').map(rawRow => {
          const row = parseInt(rawRow) - 1
          return coordinateToNumber({
            column,
            row,
          })
        })
      })

      const periods: Period[] = []

      for (const term of termList) {
        periods.push({
          term,
          coordinates,
        })
      }

      return periods
    }
  }
}

const { hostname } = location

const rawGetPeriods = (periodsGetters[hostname] ?? (() => () => null))()

export const getPeriods: PeriodsGetter = remarks => {
  const periods = rawGetPeriods(remarks)
  if (periods === null) {
    return null
  }

  return periods
    .map(({ term, coordinates: rawCoordinates }) => {
      const coordinates = rawCoordinates.filter(coordinate => isFinite(coordinate))
      return {
        term,
        coordinates,
      }
    })
    .filter(
      period => period.coordinates.length > 0
    )
}
