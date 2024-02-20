/**
 * Remove specified value by an index from an array.
 * @param array The array from which the value is removed
 * @param index The index of the removed value
 * @returns A new array with the value removed
 */
export const arrayRemove = <T>(array: T[], index: number) => {
  return array.filter((_, i) => i !== index)
}

/**
 * Insert a value to an array.
 * @param array The array to which the value is inserted
 * @param index The index of the inserted value
 * @param value The inserted value
 * @returns A new array with the value inserted
 */
export const arrayInsert = <T>(array: T[], index: number, value: T) => {
  return [
    ...array.slice(0, index),
    value,
    ...array.slice(index)
  ]
}
