import { ReactNode, useState, PointerEvent, useRef, CSSProperties } from "react"
import { cn } from "@/lib/utils"
import { useResizable } from "@/hooks/useResizable"
import { clamp } from "@/utils/clamp"

export const PageResizable = (props: {
  initialMiddle: number
  minMiddle: number
  maxMiddle: number
  className?: string
  left: ReactNode
  right: ReactNode
  disabled?: boolean
  onResize?: (middle: number) => void
}) => {
  const getClampedMiddle = (middle: number) => clamp(middle, props.minMiddle, props.maxMiddle)

  const [middle, setMiddle] = useState(getClampedMiddle(props.initialMiddle))
  const { grabbing, offsetX, resizableProps } = useResizable(({ offsetX }) => {
    const newMiddle = getClampedMiddle(middle + offsetX)
    setMiddle(newMiddle)
    props.onResize?.call(this, newMiddle)
  }, props.disabled)

  const clampedMiddle = getClampedMiddle(middle + offsetX)

  const style: CSSProperties = {
    gridTemplateColumns: `${clampedMiddle}px auto minmax(0, 1fr)`,
    userSelect: grabbing ? 'none' : 'auto',
  }

  return (
    <div className={cn("block lg:grid", props.className)} style={style}>
      {props.left}
      <div className="h-4 lg:w-4 lg:h-full flex justify-center">
        <div className={cn('p-1 hidden lg:block', props.disabled || 'cursor-ew-resize')} {...resizableProps}>
          <div className={cn('w-[1px] h-full', props.disabled || 'bg-slate-400')} />
        </div>
      </div>
      {props.right}
    </div>
  )
}
