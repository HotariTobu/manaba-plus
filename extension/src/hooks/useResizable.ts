import { useRef, useState } from "react"

export const useResizable = (onResize: (args: { offsetX: number, offsetY: number }) => void = () => { }, disabled?: boolean) => {
  const [grabbing, setGrabbing] = useState(false)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)

  const last = useRef({
    screenX: 0,
    screenY: 0,
  })

  const handlePointerMove = (event: PointerEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const { screenX, screenY } = last.current
    const offsetX = event.screenX - screenX
    const offsetY = event.screenY - screenY

    if (event.buttons === 0) {
      onResize({
        offsetX,
        offsetY,
      })

      setGrabbing(false)
      setOffsetX(0)
      setOffsetY(0)

      document.removeEventListener('pointermove', handlePointerMove)
    }
    else {
      setOffsetX(offsetX)
      setOffsetY(offsetY)
    }
  }

  const onPointerDown = (event: React.PointerEvent) => {
    if (disabled === true) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    setGrabbing(true)
    last.current = {
      screenX: event.screenX,
      screenY: event.screenY,
    }

    document.addEventListener('pointermove', handlePointerMove)
  }

  return {
    grabbing,
    offsetX,
    offsetY,
    resizableProps: {
      onPointerDown,
    }
  }
}
