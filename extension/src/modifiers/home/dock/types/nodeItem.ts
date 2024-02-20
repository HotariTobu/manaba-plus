import { ReactNode } from "react"
import { selectorMap } from "../../config"
import { Item } from "@/components/sortable/item"

export type Position = keyof typeof selectorMap.pageElements

export interface NodeItem extends Item {
  node: ReactNode
}
