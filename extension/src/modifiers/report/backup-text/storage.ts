import { o } from "@/stores/options"
import { sha256 } from '@/utils/hash'

// Separator middle of a page identifier and backup text
const separator = '<>'

/**
 * Convert a backup text array into a map.
 * @param array stored string array
 * @returns key-text map
 */
const mapFrom = function (array: string[]) {
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
const toArray = function (map: Map<string, string>) {
  return Array.from(map.entries()).map(function (pair) {
    const [hash, text] = pair
    return hash + separator + text
  })
}

// Get the backup text map and the page identifier.
const backupTextMap = mapFrom(o.assignments.backupText.value)
const hash = await sha256(location.href)

/**
 * Load backup text from the storage
 * @returns Loaded text
 */
export const getBackupText = () => {
  const text = backupTextMap.get(hash)
  if (typeof text === 'undefined') {
    return null
  }
  else {
    return text
  }
}

/**
 * Store backup text to the storage.
 * @param text Text to be saved
 */
export const setBackupText = (text: string) => {
  if (text.trim() === '') {
    backupTextMap.delete(hash)
  }
  else {
    backupTextMap.set(hash, text)
  }
  o.assignments.backupText.value = toArray(backupTextMap) as never[]
}
