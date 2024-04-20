import { CSSProperties, PropsWithChildren, forwardRef } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable, UseSortableArguments } from "@dnd-kit/sortable";
import { Item } from "./item";

export type SortableItemProps = {
  item: Item
  className?: string
  style?: CSSProperties
} & PropsWithChildren<Omit<UseSortableArguments, 'id'>>

export const SortableItem = forwardRef<HTMLElement, SortableItemProps>(({ item, className, style, children, ...props }, ref) => {
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

  const internalSetRef = (element: HTMLElement | null) => {
    setNodeRef(element)

    if (ref === null) {
      return
    }

    if (typeof ref === 'function') {
      ref(element)
    }
    else {
      ref.current = element
    }
  }

  return (
    <div className={className} style={mergedStyle} ref={internalSetRef} {...attributes} {...listeners}>
      {children}
    </div>
  );
})
