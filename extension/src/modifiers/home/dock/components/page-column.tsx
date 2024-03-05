import { CSSProperties, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { SortableZone } from "@/components/sortable/sortable-zone"
import type { NodeItem } from "../types/nodeItem"
import type { Position } from "../types/position"
import { PageContent } from "./page-content"
import { classMap } from "../../config"

const classNames: Record<Position, string> = {
  top: classMap.dropzone[1],
  left: classMap.dropzone[2],
  right: classMap.dropzone[3],
  bottom: classMap.dropzone[4],
  trash: classMap.dropzone.trash,
}

export const PageColumn = (props: {
  position: Position
  items: NodeItem[]
  sortable: boolean
}) => {
  const disabled = !props.sortable

  const [minHeight, setMinHeight] = useState(0)

  const ref = useRef<{
    div: HTMLDivElement | null
    last: {
      height: number
    }
  }>({
    div: null,
    last: {
      height: 0,
    },
  })

  useEffect(() => {
    const { div, last } = ref.current
    if (disabled) {
      last.height = 0
      setMinHeight(0)
      return
    }

    if (div === null) {
      return
    }

    const height = div.getBoundingClientRect().height
    if (last.height < height) {
      last.height = height
    }
    else {
      setMinHeight(last.height)
    }
  }, [props.items.length, disabled])

  const style: CSSProperties = {
    minHeight,
  }

  return (
    <div className={cn(props.sortable && classNames[props.position])}>
      <SortableZone className="h-full" containerId={props.position} items={props.items} disabled={disabled}>
        <div className="gap-4 flex flex-col" style={style} ref={div => ref.current.div = div}>
          {props.items.map(item => (
            <PageContent item={item} sortable={props.sortable} key={item.id} />
          ))}
        </div>
      </SortableZone>
    </div>
  )
}
