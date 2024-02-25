import { useState } from "react"
import { cn } from "@/lib/utils";
import { SortableContainer } from "@/components/sortable/sortable-container";
import type { NodeItem, NodeItemsMap } from "../types/nodeItem";
import { useLongPress } from "../hooks/longPress";
import { PageContext, PageSetterContext, PageStatus } from "../hooks/pageContext";
import { toLayout } from "../layout";
import { store } from "../store";
import { PageResizable } from "./page-resizable";
import { PageColumn } from "./page-column";
import { ContentBase } from "./page-content";

const Overlay = (props: {
  item: NodeItem
}) => <ContentBase className="shadow-xl" item={props.item} />

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
        <div className=" min-h-screen gap-4 flex flex-col" {...longPress}>
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
              onResized={m => store.middle = m}
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
