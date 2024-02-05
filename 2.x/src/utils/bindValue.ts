/**
 * Replace placeholders in a string with specific values.
 * Placeholders are surrounded with `$`.
 *
 * sample:
 * ```
 * import bindValue from './bind-value'
 * bindValue('This is $name$, $age$ years old.', { name: 'Tom', age: 8 })
 * // Return 'This is Tom, 8 years old.'
 * ```
 * @param text The string including placeholders
 * @param object The object including values
 * @returns The replaced string
 */
export default function (text: string, object: object) {
  const entries = Object.entries(object)
  const map = new Map(entries.map(([k, v]) => [k, String(v)]))
  const replacer = (...args: string[]) => map.get(args[1]) ?? ''
  return text.replaceAll(/\$(\w+)\$/g, replacer)
}
