/**
 * Represents an item of data set for configuration.
 */
export interface ConfigItem<T> {
  [key: string]: T | ConfigItem<T>
}

/**
 * Represents a set of a selector string and classes to be added.
 */
export interface ArrangeMapItem {
  selector: string
  className: string
}

export type StringMap = ConfigItem<string>

export type IdMap = StringMap
export type ArrangeMap = ConfigItem<ArrangeMapItem>
export type SelectorMap = StringMap
export type ClassMap = StringMap

/**
 * Rewrite recursively map's properties with the key if the value is empty.
 * @param subMap The parent map
 */
const fillEmptyKeys = (subMap: StringMap) => {
  for (const key in subMap) {
    const value = subMap[key]
    if (typeof value === 'string') {
      if (value === '') [
        subMap[key] = key
      ]
    }
    else {
      fillEmptyKeys(value)
    }
  }
}

export const defineIdMap = <M extends IdMap>(map: M): Readonly<M> => {
  fillEmptyKeys(map)
  return map
}
export const defineArrangeMap = <M extends ArrangeMap>(map: M): Readonly<M> => map
export const defineSelectorMap = <M extends SelectorMap>(map: M): Readonly<M> => map
export const defineClassMap = <M extends ClassMap>(map: M): Readonly<M> => {
  fillEmptyKeys(map)
  return map
}
