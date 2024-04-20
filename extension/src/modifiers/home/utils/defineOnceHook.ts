import { useEffect } from "react"

/**
 * Create a hook to do action only once.
 * @param action The callback called once after the contents script inserted
 * @returns A hook function
 */
export const createOnceHook = (action: () => void) => {
  let called = false

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
