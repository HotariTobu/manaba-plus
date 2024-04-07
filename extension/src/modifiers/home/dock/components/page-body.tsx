import { useEffect, useRef, useState } from "react"
import { ItemsMap } from "@/components/sortable/item";
import { SortableContainer } from "@/components/sortable/sortable-container";
import { useLongPress } from "@/hooks/useLongPress";
import type { NodeItem } from "../types/nodeItem";
import { usePageContextProvider } from "../hooks/usePageContext";
import { itemsMapToLayout } from "../layout";
import { store } from "../store";
import { PageResizable } from "./page-resizable";
import { PageColumn } from "./page-column";
import { PageContentBase } from "./page-content";
import { Trash } from "./trash";
import { cn } from "@/lib/utils";
import { useNotifications } from "../hooks/useNotifications";

export type NodeItemsMap = ItemsMap<NodeItem>

const Overlay = (props: {
  item: NodeItem
}) => <PageContentBase className="shadow-xl cursor-grabbing" item={props.item} sortable />

export const PageBody = (props: {
  itemsMap: NodeItemsMap
}) => {
  useNotifications()
  const [itemsMap, setItemsMap] = useState(props.itemsMap)

  const { Provider, providerProps } = usePageContextProvider()
  const { status, setStatus } = providerProps
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

  // Register the long press event handlers not to the container component but to the root document.
  useEffect(() => {
    document.addEventListener('pointerdown', longPress.onPointerDown)
    document.addEventListener('pointermove', longPress.onPointerMove)
    document.addEventListener('pointerup', longPress.onPointerUp)
    document.addEventListener('contextmenu', longPress.onContextMenu)
    return () => {
      document.removeEventListener('pointerdown', longPress.onPointerDown)
      document.removeEventListener('pointermove', longPress.onPointerMove)
      document.removeEventListener('pointerup', longPress.onPointerUp)
      document.removeEventListener('contextmenu', longPress.onContextMenu)
    }
  }, [status])

  // Save the page layout when some item is dropped.
  const handleDrop = (itemsMap: NodeItemsMap) => {
    const layout = itemsMapToLayout(itemsMap)
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
    <Provider {...providerProps}>
      {/* Take a bottom margin to move tall items smoothly when sortable. */}
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
            onResize={middle => store.middle = middle}
          />

          <PageColumn position="bottom" items={bottom} sortable={sortable} />

          <Trash visible={sortable}>
            <PageColumn position="trash" items={trash} sortable={sortable} />
          </Trash>
        </SortableContainer>
      </div>
    </Provider>
  )
}
