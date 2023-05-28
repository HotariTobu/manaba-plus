const separator = '<>'

/**
 * Convert a backup text array into a map.
 * @param array stored string array
 * @returns key-text map
 */
export const mapFrom = function (array: string[]) {
  const pairs: [string, string][] = array.map(function (item) {
    const index = item.indexOf(separator)
    const hash = item.substring(0, index)
    const text = item.substring(index + separator.length)
    return [hash, text]
  })
  return new Map(pairs)
}

/**
 * Convert a backup text map into an array.
 * @param map key-text map
 * @returns storable text array
 */
export const toArray = function (map: Map<string, string>) {
  return Array.from(map.entries()).map(function (hash, text) {
    return hash + separator + text
  })
}
