import { useState } from "react"
import { UniqueIdentifier } from '@dnd-kit/core';
import { SortableContainer } from "@/components/sortable/sortable-container";
import { SortableColumn } from "@/components/sortable/sortable-column";
import type { NodeItem } from "../types/nodeItem";
import { PageContent } from "./page-content";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { RootContainer } from "@/components/root-container";

const Overlay = (props: {
  item: NodeItem
}) => props.item.node

const classNames: Record<string, string> = {
  top: "bg-red-100 col-span-2",
  left: "bg-yellow-100",
  right: "bg-green-100",
  bottom: "bg-blue-100 col-span-2",
}

export const PageBody = (props: {
  itemsMap: Map<UniqueIdentifier, NodeItem[]>
}) => {
  const [itemsMap, setItemsMap] = useState(props.itemsMap)

  return (
    <RootContainer>
      <ResizablePanelGroup
        direction="vertical"
        className="min-h-[200px] max-w-md rounded-lg border"
      >
        <ResizablePanel defaultSize={25}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Header</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Content</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </RootContainer>
  )

  return (
    <SortableContainer className="gap-4 grid grid-cols-[1fr_auto]" itemsMap={itemsMap} setItemsMap={setItemsMap} Overlay={Overlay}>
      {Array.from(itemsMap).map(([position, items]) => (
        <SortableColumn className={classNames[position]} containerId={position} items={items} key={position}>
          <div className=" min-h-8 gap-4 flex flex-col">
            {items.map(item => (
              <PageContent item={item} key={item.id} />
            ))}
          </div>
        </SortableColumn>
      ))}
    </SortableContainer>
  )
}
