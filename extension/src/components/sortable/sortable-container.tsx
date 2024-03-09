import { ReactNode, useState } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  UniqueIdentifier,
  Over,
  Active,
  closestCorners,
  CollisionDetection,
  DndContextProps,
  pointerWithin,
  DragCancelEvent,
  DroppableContainer,
} from "@dnd-kit/core";
import { arrayMove, hasSortableData } from "@dnd-kit/sortable";
import { arrayInsert, arrayRemove } from "@/utils/arrayUtils";
import { Item, ItemsMap } from "./item";
import { hasSortableZoneData, isSortableZoneCollision } from "./sortable-zone";

export type CollisionDetectionArgs = Parameters<CollisionDetection>[0]
export type DragStart = (event: DragStartEvent) => void
export type DragOver = (event: DragOverEvent) => void
export type DragEnd = (event: DragEndEvent) => void
export type DragCancel = (event: DragCancelEvent) => void

interface SortableContainerProps<I extends Item> extends
  Omit<
    DndContextProps,
    'collisionDetection'
    | 'onDragStart'
    | 'onDragOver'
    | 'onDragEnd'
    | 'onDragCancel'
  > {
  itemsMap: ItemsMap<I>
  setItemsMap: (itemsMap: ItemsMap<I>) => void

  overlayClassName?: string
  Overlay: (props: { item: I }) => ReactNode

  createCollisionDetection?: (defaultDetector: CollisionDetection) => CollisionDetection
  createDragStartHandler?: (defaultHandler: DragStart) => DragStart
  createDragOverHandler?: (defaultHandler: DragOver) => DragOver
  createDragEndHandler?: (defaultHandler: DragEnd) => DragEnd
  createDragCancelHandler?: (defaultHandler: DragCancel) => DragCancel

  onDropped?: (itemsMap: ItemsMap<I>) => void
  setIsDragging?: (dragging: boolean) => void
}

export const SortableContainer = <I extends Item>({
  itemsMap,
  setItemsMap,

  overlayClassName,
  Overlay,

  createCollisionDetection,
  createDragStartHandler,
  createDragOverHandler,
  createDragEndHandler,
  createDragCancelHandler,

  onDropped = () => { },
  setIsDragging = () => { },

  children,
  ...props
}: SortableContainerProps<I>) => {
  const [activeItem, setActiveItem] = useState<I | null>(null);

  const detectCollision: CollisionDetection = args => {
    const pointerCollisions = pointerWithin(args)
    const cornerCollisions = closestCorners(args)
    const collisions = pointerCollisions.concat(cornerCollisions)

    const closestContainer = collisions.find(collision => {
      return isSortableZoneCollision(collision)
    })

    if (typeof closestContainer === 'undefined') {
      return collisions
    }

    const sortableCollisions = collisions.filter(({ data }) => {
      const container = data?.droppableContainer as DroppableContainer
      if (hasSortableData(container)) {
        const { containerId } = container.data.current.sortable
        return closestContainer.id === containerId
      }
      else {
        return false
      }
    })

    if (sortableCollisions.length === 0) {
      return [closestContainer].concat(collisions)
    }

    return sortableCollisions
  }

  interface Data {
    containerId: UniqueIdentifier
    items: I[]
    index: number
  }

  const getFromData = (active: Active): Data | null => {
    if (hasSortableData(active)) {
      const { containerId, index } = active.data.current.sortable
      return {
        containerId,
        items: itemsMap.get(containerId) ?? [],
        index
      }
    }
    else {
      return null
    }
  }

  const getToData = (over: Over): Data | null => {
    if (hasSortableZoneData(over)) {
      return {
        containerId: over.id,
        items: itemsMap.get(over.id) ?? [],
        index: NaN,
      }
    }
    else {
      if (hasSortableData(over)) {
        const { containerId, index } = over.data.current.sortable
        return {
          containerId,
          items: itemsMap.get(containerId) ?? [],
          index
        }
      }
      else {
        return null
      }
    }
  }

  const getData = (event: { active: Active, over: Over | null }) => {
    const { active, over } = event;
    if (over === null) {
      return null
    }

    if (active.id === over.id) {
      return null
    }

    const from = getFromData(active)
    const to = getToData(over)

    if (from === null || to === null) {
      return null
    }

    return {
      from,
      to,
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const from = getFromData(event.active)
    if (from === null) {
      return
    }

    const item = from.items[from.index]
    setActiveItem(item)
    setIsDragging(true)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const data = getData(event)
    if (data == null) {
      return
    }

    const { from, to } = data

    if (from.containerId === to.containerId) {
      return
    }

    const item = from.items[from.index]
    if (typeof item === 'undefined') {
      return
    }

    const newFromItems = arrayRemove(from.items, from.index)
    const newToItems = arrayInsert(to.items, to.index, item)

    const newItemsMap = new Map([
      ...itemsMap.entries(),
      [from.containerId, newFromItems],
      [to.containerId, newToItems],
    ])
    setItemsMap(newItemsMap)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const data = getData(event)
    if (data == null) {
      onDropped(itemsMap)
      return
    }

    const { from, to } = data

    const newFromItems = arrayMove(from.items, from.index, to.index)

    const newItemsMap = new Map([
      ...itemsMap.entries(),
      [from.containerId, newFromItems],
    ])
    setItemsMap(newItemsMap)

    onDropped(newItemsMap)
    setIsDragging(false)
  }

  const handleDragCancel = () => {
    onDropped(itemsMap)
    setIsDragging(false)
  }

  return (
    <DndContext
      collisionDetection={typeof createCollisionDetection === 'undefined' ? detectCollision : createCollisionDetection(detectCollision)}
      onDragStart={typeof createDragStartHandler === 'undefined' ? handleDragStart : createDragStartHandler(handleDragStart)}
      onDragOver={typeof createDragOverHandler === 'undefined' ? handleDragOver : createDragOverHandler(handleDragOver)}
      onDragEnd={typeof createDragEndHandler === 'undefined' ? handleDragEnd : createDragEndHandler(handleDragEnd)}
      onDragCancel={typeof createDragCancelHandler === 'undefined' ? handleDragCancel : createDragCancelHandler(handleDragCancel)}
      {...props}
    >
      {children}
      <DragOverlay className={overlayClassName}>
        {activeItem && <Overlay item={activeItem} />}
      </DragOverlay>
    </DndContext>
  );
}
