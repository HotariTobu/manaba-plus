import { ReactNode } from "react"
import type { UniqueIdentifier } from "@dnd-kit/core"
import type { Item } from "@/components/sortable/item"

/** AN item of a sortable node */
export interface NodeItem extends Item {
  node: ReactNode
}

/** An items map of node items */
export type NodeItemsMap = Map<UniqueIdentifier, NodeItem[]>
