import { coordinateToNumber } from "./types/coordinate"

/**
 * Join keys of an object with `|` and create a regex string.
 * @example
 * const obj = {
 *   a: 1,
 *   b: 2,
 * }
 * joinKeys(obj)
 * // '(a|b)'
 * @param obj The object that has keywords as properties
 * @returns A string joined with the object properties
 */
const joinKeys = (obj: object) => {
  const keys = Object.keys(obj)
  return `(${keys.join('|')})`
}

/**
 * Join keys and values of an object with `|` and create a regex string.
 * @example
 * const obj = {
 *   a: 1,
 *   b: 2,
 * }
 * joinKeysValues(obj)
 * // '(a|b|1|2)'
 * @param obj The object that has keywords as properties
 * @returns A string joined with the object properties
 */
const joinKeysValues = (obj: object) => {
  const keys = Object.keys(obj)
  const values = Object.values(obj)
  const keysValues = keys.concat(values)
  return `(${keysValues.join('|')})`
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
} as const
const dayGroup = joinKeys(days)

export interface Period {
  module: string
  coordinates: number[]
}

type PeriodsGetter = (remarks: string) => Period[] | null

const periodsGetters: Record<string, (() => PeriodsGetter) | undefined> = {
  "room.chuo-u.ac.jp": () => {
    const modules: Record<string, string> = {
      '前': 'fir',
      '後': 'sec',
      '通': 'ful',
    }
    const moduleGroup = joinKeysValues(modules)

    const moduleRegex = new RegExp(moduleGroup, 'i')
    const periodRegex = new RegExp(`${dayGroup}.*?(\\d+)`, 'ig')

    return (remarks: string) => {
      const moduleMatch = moduleRegex.exec(remarks)
      if (moduleMatch === null) {
        return null
      }
      const periodMatches = Array.from(remarks.matchAll(periodRegex))

      const rawModule = moduleMatch[1].toLowerCase()
      const module = modules[rawModule] ?? rawModule

      const coordinates = periodMatches.map(periodMatch => {
        const rawDay = periodMatch[1].toLowerCase()
        const column = days[rawDay]
        const row = parseInt(periodMatch[2]) - 1
        return coordinateToNumber({
          column,
          row,
        })
      })

      const moduleList = module === 'ful' ? ['fir', 'sec'] : [module]
      const periods: Period[] = []

      for (const module of moduleList) {
        periods.push({
          module,
          coordinates,
        })
      }

      return periods
    }
  },
  "manaba.tsukuba.ac.jp": () => {
    const modules: Record<string, string> = {
      '春': 'spr',
      '秋': 'aut',
    }
    const moduleGroup = joinKeysValues(modules)

    const moduleRegex = new RegExp(`${moduleGroup}.*?([A-C]{1,})`, 'ig')
    const periodRegex = new RegExp(`${dayGroup}.*?([\\d,]+)`, 'ig')

    return (remarks: string) => {
      const moduleMatches = Array.from(remarks.matchAll(moduleRegex))
      const periodMatches = Array.from(remarks.matchAll(periodRegex))

      const moduleList = moduleMatches.flatMap(moduleMatch => {
        const rawModule = moduleMatch[1].toLowerCase()
        const module = modules[rawModule] ?? rawModule
        return Array.from(moduleMatch[2]).map(
          subModule => `${module}_${subModule}`
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

      for (const module of moduleList) {
        periods.push({
          module,
          coordinates,
        })
      }

      return periods
    }
  },
  "slms.mi.sanno.ac.jp": () => {
    const modules: Record<string, string> = {
      '前': 'fir',
      '後': 'sec',
      '通': 'ful',
      'term 1': 'fir',
      'term 2': 'sec',
    }
    const moduleGroup = joinKeys(modules)

    const moduleRegex = new RegExp(moduleGroup, 'i')
    const periodRegex = new RegExp(`${dayGroup}.*?(\\d+)`, 'ig')

    return (remarks: string) => {
      const moduleMatch = moduleRegex.exec(remarks)
      if (moduleMatch === null) {
        return null
      }
      const periodMatches = Array.from(remarks.matchAll(periodRegex))

      const rawModule = moduleMatch[1].toLowerCase()
      const module = modules[rawModule] ?? rawModule

      const coordinates = periodMatches.map(periodMatch => {
        const rawDay = periodMatch[1].toLowerCase()
        const column = days[rawDay]
        const row = parseInt(periodMatch[2]) - 1
        return coordinateToNumber({
          column,
          row,
        })
      })

      const moduleList = module === 'ful' ? ['fir', 'sec'] : [module]
      const periods: Period[] = []

      for (const module of moduleList) {
        periods.push({
          module,
          coordinates,
        })
      }

      return periods
    }
  },
}

periodsGetters["daito.manaba.jp"] = periodsGetters["room.chuo-u.ac.jp"]

debug: {
  console.log(periodsGetters)
}

const { hostname } = location

const rawGetPeriods = (periodsGetters[hostname] ?? (() => () => null))()

export const getPeriods: PeriodsGetter = remarks => {
  const periods = rawGetPeriods(remarks)
  if (periods === null) {
    return null
  }

  return periods
    .map(({ module, coordinates: rawCoordinates }) => {
      const coordinates = rawCoordinates.filter(coordinate => isFinite(coordinate))
      return {
        module,
        coordinates,
      }
    })
    .filter(
      period => period.coordinates.length > 0
    )
}
