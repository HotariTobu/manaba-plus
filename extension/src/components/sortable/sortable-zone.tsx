import { CSSProperties, HtmlHTMLAttributes } from "react";
import { UniqueIdentifier, UseDroppableArguments, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  SortableContextProps,
  SortingStrategy,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { Item } from "./item";

interface SortableColumnProps<I> extends Omit<SortableContextProps, 'id' | 'items'> {
  containerId: UniqueIdentifier
  items: I[]
  strategy?: SortingStrategy
  className?: string
  style?: CSSProperties
  useDroppableProps?: Omit<UseDroppableArguments, 'id'>
  droppableDivProps?: Omit<HtmlHTMLAttributes<HTMLDivElement>, 'className'>
}

export const SortableZone = <I extends Item>({ containerId, items, strategy = verticalListSortingStrategy, className, style, useDroppableProps, droppableDivProps, children, ...props }: SortableColumnProps<I>) => {
  const { setNodeRef } = useDroppable({
    id: containerId,
    ...useDroppableProps,
  });

  return (
    <SortableContext
      id={String(containerId)}
      items={items}
      strategy={strategy}
      {...props}
    >
      <div className={className} style={style} ref={setNodeRef} {...droppableDivProps} >
        {children}
      </div>
    </SortableContext>
  );
}
