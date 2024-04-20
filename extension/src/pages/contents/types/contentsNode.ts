import { ContentsStatus } from "./contents"

export type ContentsBranchNode = {
  url: string
  children: Map<string, ContentsNode>
}

export type ContentsLeafNode = {
  url: string
  status: ContentsStatus
}

export type ContentsNode = ContentsBranchNode | ContentsLeafNode

export const isContentsLeafNode = (node: ContentsNode): node is ContentsLeafNode => {
  return 'status' in node
}
