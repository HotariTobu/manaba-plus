import { ReactNode, useState, PointerEvent, useRef, CSSProperties } from "react"
import { cn } from "@/lib/utils"

/**
 * Clamp number in [min, max].
 * @param num The number
 * @param min The minimum number
 * @param max The maximum number
 * @returns The clamped number
 */
const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

export const PageResizable = (props: {
  initialMiddle: number
  minMiddle: number
  maxMiddle: number
  className?: string
  left: ReactNode
  right: ReactNode
  disabled?: boolean
  onResized?: (middle: number) => void
}) => {
  const [middle, setMiddle] = useState(clamp(props.initialMiddle, props.minMiddle, props.maxMiddle))
  const [dragging, setDragging] = useState(false)

  const last = useRef({
    screenX: 0,
    middle: 0,
  })

  const handleDown = (event: PointerEvent) => {
    if (props.disabled) {
      return
    }

    event.preventDefault()

    setDragging(true)
    last.current = {
      screenX: event.screenX,
      middle: middle,
    }
  }

  const handleMove = (event: PointerEvent) => {
    if (dragging) {
      event.preventDefault()

      if (event.buttons === 0) {
        setDragging(false)
        props.onResized?.call(this, middle)
      }
      else {
        const { middle, screenX } = last.current
        const dif = event.screenX - screenX
        setMiddle(clamp(middle + dif, props.minMiddle, props.maxMiddle))
      }
    }
  }

  const style: CSSProperties = {
    gridTemplateColumns: `${middle}px auto minmax(0, 1fr)`,
    userSelect: dragging ? 'none' : 'auto',
  }

  return (
    <div className={cn("block lg:grid", props.className)} style={style} onPointerMove={handleMove}>
      {props.left}
      <div className="h-4 lg:w-4 lg:h-full flex justify-center">
        <div className={cn('p-1 hidden lg:block', props.disabled || 'cursor-ew-resize')} onPointerDown={handleDown}>
          <div className={cn('w-[1px] h-full', props.disabled || 'bg-slate-400')} />
        </div>
      </div>
      {props.right}
    </div>
  )
}
