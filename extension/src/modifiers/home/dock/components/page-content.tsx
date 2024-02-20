import { SortableItem } from "@/components/sortable/sortable-item";
import { NodeItem } from "../types/nodeItem";

export const Content = (props: {
  item: NodeItem
}) => props.item.node

export const PageContent = (props: {
  item: NodeItem
}) => {
  return (
    <div>
      <SortableItem item={props.item} Content={Content} />
    </div>
  )
}
