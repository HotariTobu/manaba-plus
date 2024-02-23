import { addClass, c, f, replace } from "@/utils/element"
import { mount } from "@/utils/mount"
import type { NodeItem } from "./types/nodeItem"
import { fromLayout } from "./layout"
import { store } from "./store"
import { arrangeMap, selectorMap } from "../config"
import { PageBody } from "./components/page-body"

type Pair = [string, HTMLElement]

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

const getIdOf = (element: Element) => {
  const entries = Array.from(element.attributes).map(attribute => {
    return [attribute.name, attribute.value]
  })
  entries.push(['tagName', element.tagName])
  const obj = Object.fromEntries(entries)
  return JSON.stringify(obj)
}

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

export default () => {
  replace(selectorMap.pageBody, pageBody => {
    const clonePairs = getPageElements(pageBody)
    if (clonePairs.length === 0) {
      return null
    }

    arrangePageElements(clonePairs)

    const itemPairs = clonePairs.map(cloneToItem)

    const itemsMap = fromLayout(itemPairs, store.pageLayout)

    const container = c('div')
    mount(<PageBody itemsMap={itemsMap} />, container)
    return container
  })
}
