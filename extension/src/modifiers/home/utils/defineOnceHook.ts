import { useEffect } from "react"

let called = false

/**
 * Define a hook to do action only once.
 * @param action The callback called once after the contents script inserted
 * @returns A hook function
 */
export const defineOnceHook = (action: () => void) => {
  return () => {
    useEffect(() => {
      if (called) {
        return
      }

      action()

      return () => {
        called = true
      }
    }, [])
  }
}
