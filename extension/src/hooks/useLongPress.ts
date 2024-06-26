import { PointerEvent as ReactPointerEvent, useRef } from "react"

/** Represents a coordinate of a point */
type Point = {
  screenX: number
  screenY: number
}

/**
 * Get the distance of 2 points.
 * @param a The point
 * @param b Another point
 * @returns The distance of the points
 */
const distance = (a: Point, b: Point) => {
  const disX = a.screenX - b.screenX
  const disY = a.screenY - b.screenY
  return Math.sqrt(disX * disX + disY * disY)
}

/**
 * Provide props to detect long presses.
 * @param callback The function called when the user presses long
 * @param delay The needed pressing time
 * @param tolerance How long the pointer can move
 * @returns Event handlers
 */
export const useLongPress = (callback: () => void, options?: {
  stopPropagation?: boolean
  delay?: number
  tolerance?: number
}) => {
  const {
    stopPropagation = false,
    delay = 1000,
    tolerance = 10,
  } = options ?? {}

  const ref = useRef<{
    timeout: NodeJS.Timeout | null
    start: Point
    last: Point
  }>({
    timeout: null,
    start: {
      screenX: 0,
      screenY: 0,
    },
    last: {
      screenX: 0,
      screenY: 0,
    }
  })

  const clear = () => {
    if (ref.current.timeout !== null) {
      clearTimeout(ref.current.timeout)
      ref.current.timeout = null
    }
  }

  const onTimeout = () => {
    const { start, last } = ref.current
    if (distance(start, last) > tolerance) {
      return
    }

    callback()
  }

  const onPointerDown = (event: PointerEvent | ReactPointerEvent) => {
    // Skip when the pointer on the scrollbar
    if (event.target instanceof Element) {
      const { clientWidth, clientHeight } = event.target
      const { offsetX, offsetY } = 'nativeEvent' in event ? event.nativeEvent : event
      if (clientWidth < offsetX || clientHeight < offsetY) {
        return
      }
    }

    if (stopPropagation) {
      event.stopPropagation()
    }

    clear()

    ref.current.start.screenX = event.screenX
    ref.current.start.screenY = event.screenY

    onPointerMove(event)

    ref.current.timeout = setTimeout(onTimeout, delay)
  }

  const onPointerMove = (event: PointerEvent | ReactPointerEvent) => {
    if (event.buttons === 0) {
      clear()
    }
    else {
      ref.current.last.screenX = event.screenX
      ref.current.last.screenY = event.screenY
    }
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp: clear,
    onContextMenu: clear,
  }
}
