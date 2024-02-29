import { ReactNode } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable, UseSortableArguments } from "@dnd-kit/sortable";
import { Item } from "./item";

interface ContentProps<I> {
  item: I
  activated: boolean
}

interface SortableItemProps<I> extends Omit<UseSortableArguments, 'id'> {
  item: I
  Content: (props: ContentProps<I>) => ReactNode
}

export const SortableItem = <I extends Item>({ item, Content, ...props }: SortableItemProps<I>) => {
  const {
    active,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: item.id, ...props });

  const activated = item.id === active?.id

  const style = {
    opacity: activated ? 0 : 1,
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Content item={item} activated={activated} {...props} />
    </div>
  );
}
