import { addClass, c, f, replace } from "@/utils/element"
import { mount } from "@/utils/mount"
import { ErrorReporter } from "@/components/error-reporter"
import type { NodeItem } from "./types/nodeItem"
import { fromLayout } from "./layout"
import { store } from "./store"
import { arrangeMap, selectorMap } from "../config"
import { PageBody } from "./components/page-body"
import { coursesItem } from "./items/courses"

/** Key-value of positions and elements */
type Pair = [string, HTMLElement]

/**
 * Copy page elements from the page body.
 * @param pageBody The page body element
 * @returns An array of pairs of positions and clones of selected elements
 */
const getPageElements = (pageBody: Element) => {
  const clonePairs: Pair[] = []

  const entries = Object.entries(selectorMap.pageElements)
  for (const [position, selector] of entries) {
    if (selector === '') {
      continue
    }

    const elements = f(selector, pageBody)
    const subClonePairs = elements.map<Pair>(element => {
      const clone = element.cloneNode(true) as HTMLElement
      clone.setAttribute('default-pos', position)
      return [position, clone]
    })
    clonePairs.push(...subClonePairs)
  }

  return clonePairs
}

/**
 * Arrange clone elements' style.
 * @param clonePairs The clones
 */
const arrangePageElements = (clonePairs: Pair[]) => {
  const container = c('div')

  for (const [, clone] of clonePairs) {
    // clone.dataset.className = clone.className
    // clone.removeAttribute('class')

    clone.style.width = 'unset'
    clone.style.float = 'unset'
    clone.style.margin = 'unset'
    clone.style.padding = 'unset'

    container.appendChild(clone)
  }

  addClass(arrangeMap.contents, container)
}

/**
 * Create a unique value of the specific element.
 * @param element The element
 * @returns An id for the element
 */
const getIdOf = (element: Element) => {
  const entries = Array.from(element.attributes).map(attribute => {
    return [attribute.name, attribute.value]
  })
  entries.push(['tagName', element.tagName])
  const obj = Object.fromEntries(entries)
  return JSON.stringify(obj)
}

/**
 * Convert a clone element into a node item in a position pair.
 * @param clonePair The clone pair
 * @returns A node pair
 */
const cloneToItem = (clonePair: Pair) => {
  const [position, clone] = clonePair
  const itemsPair: [string, NodeItem] = [
    position,
    {
      id: getIdOf(clone),
      node: <div dangerouslySetInnerHTML={{ __html: clone.outerHTML }} />,
    }
  ]
  return itemsPair
}

// Entry point
export default () => {
  replace(selectorMap.pageBody, (pageBody, unhide) => {
    const clonePairs = getPageElements(pageBody)
    if (clonePairs.length === 0) {
      return null
    }

    arrangePageElements(clonePairs)

    const itemPairs = clonePairs.map(cloneToItem)

    // Add the extension's sortable items.
    itemPairs.push(['left', coursesItem])

    const positions = Object.keys(selectorMap.pageElements)
    const itemsMap = fromLayout(itemPairs, positions, store.pageLayout)

    // Not use the default container to keep the layout of the page.
    const container = c('div')
    mount((
      <ErrorReporter onError={unhide}>
        <PageBody itemsMap={itemsMap} />
      </ErrorReporter>
    ), container)
    return container
  })
}
