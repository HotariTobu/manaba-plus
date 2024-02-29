import { HtmlHTMLAttributes } from "react";
import { UniqueIdentifier, UseDroppableArguments, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  SortableContextProps,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { Item } from "./item";

interface SortableColumnProps<I> extends Omit<SortableContextProps, 'id' | 'items'> {
  containerId: UniqueIdentifier
  items: I[]
  className?: string
  useDroppableProps?: Omit<UseDroppableArguments, 'id'>
  droppableDivProps?: Omit<HtmlHTMLAttributes<HTMLDivElement>, 'className'>
}

export const SortableColumn = <I extends Item>({ containerId, items, className, useDroppableProps, droppableDivProps, children, ...props }: SortableColumnProps<I>) => {
  const { setNodeRef } = useDroppable({
    id: containerId,
    ...useDroppableProps,
  });

  return (
    <SortableContext
      id={String(containerId)}
      items={items}
      strategy={verticalListSortingStrategy}
      {...props}
    >
      <div className={className} ref={setNodeRef} {...droppableDivProps} >
        {children}
      </div>
    </SortableContext>
  );
}
