import { useEffect, useRef, useState } from "react"
import { ItemsMap } from "@/components/sortable/item";
import { SortableContainer } from "@/components/sortable/sortable-container";
import { useLongPress } from "@/hooks/useLongPress";
import type { NodeItem } from "../types/nodeItem";
import { PageContext, PageSetterContext, PageStatus } from "../hooks/usePageContext";
import { toLayout } from "../layout";
import { store } from "../store";
import { PageResizable } from "./page-resizable";
import { PageColumn } from "./page-column";
import { PageContentBase } from "./page-content";
import { Trash } from "./trash";
import { cn } from "@/lib/utils";

export type NodeItemsMap = ItemsMap<NodeItem>

const Overlay = (props: {
  item: NodeItem
}) => <PageContentBase className="shadow-xl cursor-grabbing" item={props.item} sortable />

export const PageBody = (props: {
  itemsMap: NodeItemsMap
}) => {
  const [itemsMap, setItemsMap] = useState(props.itemsMap)

  const [status, setStatus] = useState<PageStatus>('normal')
  const dragging = useRef(false)

  const longPress = useLongPress(() => {
    if (dragging.current) {
      return
    }

    if (status === 'normal') {
      setStatus('editing-dock')
    }
    else {
      setStatus('normal')
    }
  })

  useEffect(() => {
    document.addEventListener('pointerdown', longPress.onPointerDown)
    document.addEventListener('pointermove', longPress.onPointerMove)
    document.addEventListener('pointerup', longPress.onPointerUp)
    return () => {
      document.removeEventListener('pointerdown', longPress.onPointerDown)
      document.removeEventListener('pointermove', longPress.onPointerMove)
      document.removeEventListener('pointerup', longPress.onPointerUp)
    }
  }, [status])

  const handleDrop = (itemsMap: NodeItemsMap) => {
    const layout = toLayout(itemsMap)
    store.pageLayout = layout
  }

  const sortable = status === 'editing-dock'
  const disabled = !sortable

  const top = itemsMap.get('top') ?? []
  const left = itemsMap.get('left') ?? []
  const right = itemsMap.get('right') ?? []
  const bottom = itemsMap.get('bottom') ?? []
  const trash = itemsMap.get('trash') ?? []

  return (
    <PageContext.Provider value={status}>
      <PageSetterContext.Provider value={setStatus}>
        <div className={cn("min-h-screen gap-4 flex flex-col", sortable && 'mb-[100vh]')}>
          <SortableContainer itemsMap={itemsMap} setItemsMap={setItemsMap} Overlay={Overlay} onDropped={handleDrop} setIsDragging={d => dragging.current = d}>
            <PageColumn position="top" items={top} sortable={sortable} />

            <PageResizable
              initialMiddle={store.middle}
              minMiddle={260}
              maxMiddle={690}
              className={disabled ? left.length === 0 ? 'grid-cols-[0_0_1fr]' : right.length === 0 ? 'grid-cols-[1fr_0_0]' : '' : ''}
              left={<PageColumn position="left" items={left} sortable={sortable} />}
              right={<PageColumn position="right" items={right} sortable={sortable} />}
              disabled={disabled}
              onResized={middle => store.middle = middle}
            />

            <PageColumn position="bottom" items={bottom} sortable={sortable} />

            <Trash hidden={disabled}>
              <PageColumn position="trash" items={trash} sortable={sortable} />
            </Trash>
          </SortableContainer>
        </div>
      </PageSetterContext.Provider>
    </PageContext.Provider>
  )
}
