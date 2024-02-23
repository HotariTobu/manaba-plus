import { ReactNode } from "react"
import type { UniqueIdentifier } from "@dnd-kit/core"
import type { Item } from "@/components/sortable/item"

export interface NodeItem extends Item {
  node: ReactNode
}

export type NodeItemsMap = Map<UniqueIdentifier, NodeItem[]>
