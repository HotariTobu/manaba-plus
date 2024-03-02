import { cn } from "@/lib/utils";
import { SortableItem } from "@/components/sortable/sortable-item";
import { NodeItem } from "../types/nodeItem";
import { usePageContext } from "../hooks/usePageContext";

export const Content = (props: {
  item: NodeItem
  disabled?: boolean
  className?: string
}) => (
  <div className={cn("bg-white/40 transition-shadow", props.disabled || 'max-h-64 shadow-lg overflow-hidden', props.className)}>
    {props.item.node}
  </div>
)

export const PageContent = (props: {
  item: NodeItem
}) => {
  const { status } = usePageContext()

  const disabled = status !== 'editing-dock'

  return (
    <SortableItem item={props.item} Content={Content} disabled={disabled} />
  )
}
