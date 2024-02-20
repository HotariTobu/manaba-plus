import { useState } from "react"
import { UniqueIdentifier } from '@dnd-kit/core';
import { SortableContainer } from "@/components/sortable/sortable-container";
import type { NodeItem } from "../types/nodeItem";
import { useLongPress } from "../hooks/longPress";
import { PageContext, PageSetterContext, PageStatus } from "../hooks/pageContext";
import { PageResizable } from "./page-resizable";
import { PageColumn } from "./page-column";
import { ContentBase } from "./page-content";

const Overlay = (props: {
  item: NodeItem
}) => <ContentBase className="shadow-xl" item={props.item} />

export const PageBody = (props: {
  itemsMap: Map<UniqueIdentifier, NodeItem[]>
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

  const left = itemsMap.get('left') ?? []
  const right = itemsMap.get('right') ?? []

  return (
    <PageContext.Provider value={status}>
      <PageSetterContext.Provider value={setStatus}>
        <div {...longPress}>
          <SortableContainer itemsMap={itemsMap} setItemsMap={setItemsMap} Overlay={Overlay}>
            <PageColumn position="top" itemsMap={itemsMap} />

            <div className="my-4">
              <PageResizable
                initialMiddle={1000}
                minMiddle={260}
                maxMiddle={690}
                className={disabled ? left.length === 0 ? 'grid-cols-[0_0_1fr]' : right.length === 0 ? 'grid-cols-[1fr_0_0]' : '' : ''}
                left={<PageColumn position="left" itemsMap={itemsMap} />}
                right={<PageColumn position="right" itemsMap={itemsMap} />}
                disabled={disabled}
                onResized={m => console.log(m)}
              />
            </div>

            <PageColumn position="bottom" itemsMap={itemsMap} />
          </SortableContainer>
        </div>
      </PageSetterContext.Provider>
    </PageContext.Provider>
  )
}
