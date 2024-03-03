import { Item, ItemsMap } from "@/components/sortable/item"
import type { Layout } from "./types/layout"

/**
 * Create an items map with the specific layout.
 * @param itemPairs The list of tuples of positions and items
 * @param layout The stored layout
 * @returns An items map sorted with the layout
 */
export const fromLayout = <I extends Item>(itemPairs: [string, I][], positions: string[], layout: Layout) => {
  /** The map to get positions and items by ids */
  const flatItemsMap = new Map(
    itemPairs.map((pair => [
      String(pair[1].id),
      pair
    ])
  ))

  // Initialize the items map with empty items arrays.
  const itemsMap: ItemsMap<I> = new Map(
    positions.map(position => [position, []])
  )

  // Add items in the layout to the items map.
  for (const [id, position] of layout) {
    const pair = flatItemsMap.get(id)
    if (typeof pair === 'undefined') {
      continue
    }

    flatItemsMap.delete(id)
    const [, item] = pair

    const items = itemsMap.get(position)
    items?.push(item)
  }

  // Add other items.
  for (const [position, item] of flatItemsMap.values()) {
    const items = itemsMap.get(position)
    items?.push(item)
  }

  return itemsMap
}

/**
 * Create a layout with the specific items map.
 * @param itemsMap The items map
 * @returns A layout to restore the items order
 */
export const toLayout = <I extends Item>(itemsMap: ItemsMap<I>) => {
  const layout: Layout = new Map()

  for (const [position, items] of itemsMap) {
    for (const item of items) {
      const id = String(item.id)
      layout.set(id, String(position))
    }
  }

  return layout
}
