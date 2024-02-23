import { CSSProperties, useEffect, useRef, useState } from "react"
import { UniqueIdentifier } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { SortableColumn } from "@/components/sortable/sortable-column"
import type { NodeItem } from "../types/nodeItem"
import type { Position } from "../types/position"
import { usePageContext } from "../hooks/pageContext"
import { PageContent } from "./page-content"

const classNames: Record<Position, string> = {
  top: "outline-red-300",
  left: "outline-yellow-300",
  right: "outline-green-300",
  bottom: "outline-blue-300",
}

export const PageColumn = (props: {
  position: Position
  items: NodeItem[]
}) => {
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

  const { status } = usePageContext()

  const disabled = status !== 'editing-dock'

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
    <div className={cn(disabled || ['min-h-8 outline outline-dashed outline-offset-2', classNames[props.position]])}>
      <SortableColumn className="h-full" containerId={props.position} items={props.items}>
        <div className="gap-4 flex flex-col" style={style} ref={div => ref.current.div = div}>
          {props.items.map(item => (
            <PageContent item={item} key={item.id} />
          ))}
        </div>
      </SortableColumn>
    </div>
  )
}
