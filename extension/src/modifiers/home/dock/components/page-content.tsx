import { cn } from "@/lib/utils";
import { SortableItem } from "@/components/sortable/sortable-item";
import { NodeItem } from "../types/nodeItem";
import { usePageContext } from "../hooks/pageContext";

export const ContentBase = (props: {
  item: NodeItem
  className?: string
}) => (
  <div className={cn("bg-white/40 transition-shadow", props.className)}>
    {props.item.node}
  </div>
)

export const Content = (props: {
  item: NodeItem
  disabled?: boolean
}) => <ContentBase className={cn(props.disabled || 'shadow-lg')} item={props.item} />

export const PageContent = (props: {
  item: NodeItem
}) => {
  const { status } = usePageContext()

  const disabled = status !== 'editing-dock'

  return (
    <SortableItem item={props.item} Content={Content} disabled={disabled} />
  )
}
