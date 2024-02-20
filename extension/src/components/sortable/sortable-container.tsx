import { HTMLAttributes, ReactNode, useState } from "react";
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
  Modifiers,
  SensorDescriptor,
  SensorOptions,
} from "@dnd-kit/core";
import { SortableData, arrayMove } from "@dnd-kit/sortable";
import { arrayInsert, arrayRemove } from "@/utils/arrayUtils";
import { Item } from "./item";

type ItemsMap<I> = Map<UniqueIdentifier, I[]>

interface Props<I> extends HTMLAttributes<HTMLDivElement> {
  itemsMap: ItemsMap<I>
  setItemsMap: (itemsMap: ItemsMap<I>) => void
  modifiers?: Modifiers
  sensors?: SensorDescriptor<SensorOptions>[]
  Overlay: (props: { item: I }) => ReactNode
}

export const SortableContainer = <I extends Item>({ itemsMap, setItemsMap, modifiers, sensors, Overlay, ...props }: Props<I>) => {
  const [activeItem, setActiveItem] = useState<I | null>(null);

  const detectCollision: CollisionDetection = args => {
    const cornerCollisions = closestCorners(args)

    const closestContainer = cornerCollisions.find(c => {
      return itemsMap.has(c.id)
    })

    if (typeof closestContainer === 'undefined') {
      return cornerCollisions
    }

    const collisions = cornerCollisions.filter(({ data }) => {
      if (typeof data === 'undefined') {
        return false
      }

      const droppableData = data.droppableContainer?.data?.current as SortableData | undefined
      if (typeof droppableData === 'undefined') {
        return false
      }

      const { containerId } = droppableData.sortable

      return closestContainer.id === containerId
    })

    if (collisions.length === 0) {
      return [closestContainer]
    }

    return collisions
  }

  interface Data {
    containerId: UniqueIdentifier
    items: I[]
    index: number
  }

  const getFromData = (active: Active): Data => {
    const activeData = active.data.current as SortableData
    const { containerId, index } = activeData.sortable
    return {
      containerId,
      items: itemsMap.get(containerId) ?? [],
      index
    }
  }

  const getToData = (over: Over): Data => {
    const items = itemsMap.get(over.id)
    if (typeof items === 'undefined') {
      const overData = over.data.current as SortableData
      const { containerId, index } = overData.sortable
      return {
        containerId,
        items: itemsMap.get(containerId) ?? [],
        index
      }
    }
    else {
      return {
        containerId: over.id,
        items,
        index: NaN,
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

    return {
      from: getFromData(active),
      to: getToData(over),
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const from = getFromData(event.active)
    const item = from.items[from.index]
    setActiveItem(item)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const data = getData(event)
    if (data == null) {
      return
    }

    const { from, to } = data

    // console.log(event.collisions)
    // console.log(from)
    // console.log(to)

    if (from.containerId === to.containerId) {
      return
    }

    const item = from.items[from.index]

    const newFromItems = arrayRemove(from.items, from.index)
    const newToItems = arrayInsert(to.items, to.index, item)

    setItemsMap(new Map([
      ...itemsMap.entries(),
      [from.containerId, newFromItems],
      [to.containerId, newToItems],
    ]))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const data = getData(event)
    if (data == null) {
      return
    }

    const { from, to } = data

    const newFromItems = arrayMove(from.items, from.index, to.index)

    setItemsMap(new Map([
      ...itemsMap.entries(),
      [from.containerId, newFromItems],
    ]))
  }

  return (
    <DndContext
      modifiers={modifiers}
      sensors={sensors}
      collisionDetection={detectCollision}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div {...props} />
      <DragOverlay>
        {activeItem && <Overlay item={activeItem} />}
      </DragOverlay>
    </DndContext>
  );
}
