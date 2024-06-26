import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible"
import { TriangleRightIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { ContentsBranchNode, isContentsLeafNode } from "../../types/contentsNode"
import { Button } from "@/components/ui/button"
import { ContentsLeafItem } from "./contents-leaf-item"
import { ExternalLink } from "@/components/external-link"

const ContentsBranchItem = (props: {
  label: string
  contentsBranch: ContentsBranchNode
}) => {
  const [open, setOpen] = useState(true)
  return (
    <Collapsible disabled={props.contentsBranch.children.size === 0} open={open} onOpenChange={setOpen}>
      <div className="peer hover:bg-primary/20 grid grid-cols-[auto_minmax(0,_1fr)] rounded-md">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon">
            <TriangleRightIcon className={cn(open && 'rotate-90', "h-4 w-4 transition-transform")} />
          </Button>
        </CollapsibleTrigger>
        <ExternalLink className="mx-2" href={props.contentsBranch.url} label={props.label} />
      </div>
      <CollapsibleContent className="ms-4 peer-hover:bg-primary/20 rounded-md">
        <ContentsTreeItem contentsBranch={props.contentsBranch} />
      </CollapsibleContent>
    </Collapsible>
  )
}

export const ContentsTreeItem = (props: {
  contentsBranch: ContentsBranchNode
}) => (
  <>
    {Array.from(props.contentsBranch.children).map(([label, child]) => (
      <div key={label}>
        {isContentsLeafNode(child) ? (
          <ContentsLeafItem label={label} contentsLeaf={child} />
        ) : (
          <ContentsBranchItem label={label} contentsBranch={child} />
        )}
      </div>
    ))}
  </>
)
