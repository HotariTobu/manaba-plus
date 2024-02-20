import { HTMLAttributes } from "react";
import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { Item } from "./item";

interface Props<I> extends HTMLAttributes<HTMLDivElement> {
  containerId: UniqueIdentifier
  items: I[]
}

export const SortableColumn = <I extends Item>({ containerId, items, ...props }: Props<I>) => {
  const { setNodeRef } = useDroppable({
    id: containerId
  });

  return (
    <SortableContext
      id={String(containerId)}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef} {...props} />
    </SortableContext>
  );
}
