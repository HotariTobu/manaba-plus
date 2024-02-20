import { ReactNode } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable, UseSortableArguments } from "@dnd-kit/sortable";
import { Item } from "./item";

interface Props<I> extends Omit<UseSortableArguments, 'id'> {
  item: I
  Content: (props: { item: I }) => ReactNode
}

export const SortableItem = <I extends Item>({ item, Content, ...props }: Props<I>) => {
  const {
    active,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: item.id, ...props });

  const style = {
    opacity: item.id === active?.id ? 0 : 1,
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Content item={item} {...props} />
    </div>
  );
}
