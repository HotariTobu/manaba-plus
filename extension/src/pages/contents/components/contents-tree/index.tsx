import { ContentsItem } from "../../types/contents"
import { ContentsBranchNode, isContentsLeafNode } from "../../types/contentsNode"
import { ContentsTreeItem } from "./contents-branch-item"

const getContentsTree = (contentsItems: ContentsItem[]) => {
  const root: ContentsBranchNode = {
    url: '',
    children: new Map()
  }

  for (const { trace, target, status } of contentsItems) {
    let parent = root
    for (const traceItem of trace) {
      const child = parent.children.get(traceItem.label)
      if (typeof child === 'undefined') {
        const newChild: ContentsBranchNode = {
          url: traceItem.url,
          children: new Map(),
        }
        parent.children.set(traceItem.label, newChild)
        parent = newChild
      }
      else if (isContentsLeafNode(child)) {
        throw new Error(`Unexpected ContentsLeafNode: ${JSON.stringify(trace)}`)
      }
      else {
        parent = child
      }
    }

    parent.children.set(target.label, {
      url: target.url,
      status,
    })
  }

  return root
}

export const ContentsTree = (props: {
  contentsItems: ContentsItem[]
}) => {
  const root = getContentsTree(props.contentsItems)

  return (
    <ContentsTreeItem contentsBranch={root} />
  )
}
