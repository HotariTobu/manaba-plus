import { useEffect, useRef, useState } from "react"

type Breakpoints<T> = {
  [B in keyof T]: boolean
}

type SetRef = (element: HTMLElement | null) => void

/**
 * Provide stateful values for a responsive layout.
 * @example
 * const [{}]
 * @param breakpointsDefinition The definition of border values
 * @param options The option object to change the behavior
 * @returns [0] The breakpoints. True if the point is suitable, otherwise false.
 * @returns [1] A setter to get the target element to be observed.
 */
export const useBreakpoints = <T extends Record<string, number>>(breakpointsDefinition: T, options = {
  /** True if observe the resize of the target element, otherwise false */
  dynamic: true,

  /** The breakpoints would be updated when the difference of the length value from the last value was bigger than the threshold */
  threshold: 16,
}): [Breakpoints<T>, SetRef] => {
  const keys = Object.keys(breakpointsDefinition)
  if (keys.length === 0) {
    throw new Error('The breakpoints definition must have one or more points.')
  }

  const [breakpoints, setBreakpoints] = useState<Breakpoints<T> | null>(null)
  const ref = useRef<{
    element: HTMLElement | null
    lastValue: number
  }>({
    element: null,
    lastValue: 0,
  })

  const updateBreakpoints = () => {
    const { element, lastValue } = ref.current
    if (element === null) {
      return
    }

    const value = element.clientWidth
    if (Math.abs(lastValue - value) < options.threshold) {
      return
    }
    ref.current.lastValue = value

    setBreakpoints(Object.fromEntries(
      Object.entries(breakpointsDefinition).map(
        ([key, border]) => [key, border < value]
      )
    ) as Breakpoints<T>)
  }

  useEffect(() => {
    const { element } = ref.current
    if (element === null) {
      return
    }

    updateBreakpoints()

    if (options.dynamic) {
      const observer = new ResizeObserver(updateBreakpoints)
      observer.observe(element)
      return () => observer.unobserve(element)
    }
  }, [options])

  /** Should be passed to the ref props of the target element */
  const setRef: SetRef = element => {
    ref.current.element = element
  }

  return [
    breakpoints ?? Object.fromEntries(
      keys.map(key => [key, false])
    ) as Breakpoints<T>,
    setRef
  ]
}
