import { ReactNode } from "react"
import { Item } from "@/components/sortable/item"

export interface NodeItem extends Item {
  node: ReactNode
}
