import { useEffect, useState } from "react"
import { UniqueIdentifier } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { SortableContainer } from "@/components/sortable/sortable-container";
import { useLongPress } from "@/hooks/useLongPress";
import type { NodeItem } from "../types/nodeItem";
import { PageContext, PageSetterContext, PageStatus } from "../hooks/usePageContext";
import { toLayout } from "../layout";
import { store } from "../store";
import { PageResizable } from "./page-resizable";
import { PageColumn } from "./page-column";
import { Content } from "./page-content";

export type NodeItemsMap = Map<UniqueIdentifier, NodeItem[]>

const Overlay = (props: {
  item: NodeItem
}) => <Content className="shadow-xl" item={props.item} />

export const PageBody = (props: {
  itemsMap: NodeItemsMap
}) => {
  const [itemsMap, setItemsMap] = useState(props.itemsMap)
  const [status, setStatus] = useState<PageStatus>('normal')

  const disabled = status !== 'editing-dock'

  const longPress = useLongPress(() => {
    if (disabled) {
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

  const top = itemsMap.get('top') ?? []
  const left = itemsMap.get('left') ?? []
  const right = itemsMap.get('right') ?? []
  const bottom = itemsMap.get('bottom') ?? []
  const trash = itemsMap.get('trash') ?? []

  return (
    <PageContext.Provider value={status}>
      <PageSetterContext.Provider value={setStatus}>
        <div className="min-h-screen gap-4 flex flex-col">
          <SortableContainer itemsMap={itemsMap} setItemsMap={setItemsMap} Overlay={Overlay} onDropped={handleDrop}>
            <PageColumn position="top" items={top} />

            <PageResizable
              initialMiddle={store.middle}
              minMiddle={260}
              maxMiddle={690}
              className={disabled ? left.length === 0 ? 'grid-cols-[0_0_1fr]' : right.length === 0 ? 'grid-cols-[1fr_0_0]' : '' : ''}
              left={<PageColumn position="left" items={left} />}
              right={<PageColumn position="right" items={right} />}
              disabled={disabled}
              onResized={middle => store.middle = middle}
            />

            <PageColumn position="bottom" items={bottom} />

            <div className={cn(disabled && 'hidden', 'opacity-50')}>
              <PageColumn position="trash" items={trash} />
            </div>
          </SortableContainer>
        </div>
      </PageSetterContext.Provider>
    </PageContext.Provider>
  )
}
