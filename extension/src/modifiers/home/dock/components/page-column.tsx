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
  return (
    <SortableZone className={cn(props.sortable && classNames[props.position])} containerId={props.position} items={props.items} disabled={!props.sortable} growOnly={props.sortable}>
      <div className={cn("gap-4 flex flex-col", props.sortable && 'min-h-8')}>
        {props.items.map(item => (
          <PageContent item={item} sortable={props.sortable} key={item.id} />
        ))}
      </div>
    </SortableZone>
  )
}
