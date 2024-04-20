/**
 * Represents an item of data set for configuration.
 */
export type ConfigItem<T> = {
  [key: string]: T | ConfigItem<T>
}

/**
 * Represents a set of a selector string and classes to be added.
 */
export type ArrangeMapItem = {
  selector: string
  className: string
}

export type ArrangeMap = ConfigItem<ArrangeMapItem>
export type SelectorMap = ConfigItem<string>
export type ClassMap = ConfigItem<string>
