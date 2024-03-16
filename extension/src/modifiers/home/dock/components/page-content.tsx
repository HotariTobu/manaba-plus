import { cn } from "@/lib/utils";
import { SortableItem } from "@/components/sortable/sortable-item";
import { NodeItem } from "../types/nodeItem";

export const PageContentBase = ({ item, sortable, className, ...props }: {
  item: NodeItem
  sortable: boolean
  className?: string
}) => (
  <div className={cn("bg-white/40 transition-shadow", sortable && 'max-h-64 shadow-lg overflow-hidden', className)} {...props}>
    {item.node}
  </div>
)

export const PageContent = (props: {
  item: NodeItem
  sortable: boolean
}) => (
  <SortableItem className={cn(props.sortable ? 'cursor-grab' : 'cursor-auto')} item={props.item} disabled={!props.sortable}>
    <PageContentBase item={props.item} sortable={props.sortable} />
  </SortableItem>
)
