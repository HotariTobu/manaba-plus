import { ReactNode } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Item } from "./item";

export const SortableItem = <I extends Item>(props: {
  item: I
  Content: (props: { item: I }) => ReactNode
}) => {
  const {
    active,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.item.id, });

  const style = {
    opacity: props.item.id === active?.id ? 0 : 1,
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <props.Content item={props.item} />
    </div>
  );
}
