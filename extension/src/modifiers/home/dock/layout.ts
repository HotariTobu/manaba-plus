import type { Layout } from "./types/layout"
import type { NodeItem, NodeItemsMap } from "./types/nodeItem"
import { selectorMap } from "../config"

export const fromLayout = (itemPairs: [string, NodeItem][], layout: Layout) => {
  const positions = Object.keys(selectorMap.pageElements)
  const itemsMap: NodeItemsMap = new Map(
    positions.map(position => [position, []])
  )

  for (const [defaultPosition, item] of itemPairs) {
    const key = String(item.id)
    const position = layout.get(key) ?? defaultPosition
    const items = itemsMap.get(position)
    items?.push(item)
  }

  return itemsMap
}

export const toLayout = (itemsMap: NodeItemsMap) => {
  const layout: Layout = new Map()

  for (const [position, items] of itemsMap) {
    for (const item of items) {
      const key = String(item.id)
      layout.set(key, String(position))
    }
  }

  return layout
}
