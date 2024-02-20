import { PointerEvent, useRef } from "react"

interface Point {
  screenX: number
  screenY: number
}

const distance = (a: Point, b: Point) => {
  const disX = a.screenX - b.screenX
  const disY = a.screenY - b.screenY
  return Math.sqrt(disX * disX + disY * disY)
}

export const useLongPress = (callback: () => void, delay = 1000, tolerance = 20) => {
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

  const onPointerDown = (event: PointerEvent) => {
    clear()

    ref.current.start.screenX = event.screenX
    ref.current.start.screenY = event.screenY

    onPointerMove(event)

    ref.current.timeout = setTimeout(onTimeout, delay)
  }

  const onPointerMove = (event: PointerEvent) => {
    if (event.buttons === 0) {
      clear()
    }
    else {
      ref.current.last.screenX = event.screenX
      ref.current.last.screenY = event.screenY
    }
  }

  const onPointerUp = (event: PointerEvent) => {
    clear()
  }

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
  }
}
