import { CSSProperties, PropsWithChildren } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable, UseSortableArguments } from "@dnd-kit/sortable";
import { Item } from "./item";

interface SortableItemProps<I> extends PropsWithChildren<Omit<UseSortableArguments, 'id'>> {
  item: I
  className?: string
  style?: CSSProperties
}

export const SortableItem = <I extends Item>({ item, className, style, children, ...props }: SortableItemProps<I>) => {
  const {
    active,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: item.id, ...props });

  const activated = item.id === active?.id

  const mergedStyle = {
    opacity: activated ? 0 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
    ...style
  };

  return (
    <div className={className} style={mergedStyle} ref={setNodeRef} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
