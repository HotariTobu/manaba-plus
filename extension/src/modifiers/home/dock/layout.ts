import type { Layout } from "./types/layout"
import type { NodeItem, NodeItemsMap } from "./types/nodeItem"
import { selectorMap } from "../config"

type ItemPair = [string, NodeItem]

export const fromLayout = (itemPairs: ItemPair[], layout: Layout) => {
  const flatItemsMap = new Map(
    itemPairs.map((pair => [
      String(pair[1].id),
      pair
    ])
  ))

  const positions = Object.keys(selectorMap.pageElements)
  const itemsMap: NodeItemsMap = new Map(
    positions.map(position => [position, []])
  )

  for (const [key, position] of layout) {
    const pair = flatItemsMap.get(key)
    if (typeof pair === 'undefined') {
      continue
    }

    flatItemsMap.delete(key)
    const [, item] = pair

    const items = itemsMap.get(position)
    items?.push(item)
  }

  for (const [position, item] of flatItemsMap.values()) {
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
