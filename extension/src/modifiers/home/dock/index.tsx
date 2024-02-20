import { addClass, c, f, replace } from "@/utils/element"
import { mount } from "@/utils/mount"
import { arrangeMap, selectorMap } from "../config"
import type { NodeItem } from "./types/nodeItem"
import { PageBody } from "./components/page-body"

const getIdOf = (element: Element) => {
  const entries = Array.from(element.attributes).map(attribute => {
    return [attribute.name, attribute.value]
  })
  entries.push(['tagName', element.tagName])
  const obj = Object.fromEntries(entries)
  return JSON.stringify(obj)
}

export default () => {
  replace(selectorMap.pageBody, pageBody => {
    const container = c('div')

    const clonesEntries: [string, HTMLElement[]][] = []

    const entries = Object.entries(selectorMap.pageElements)
    for (const [position, selector] of entries) {
      const clones: HTMLElement[] = []
      clonesEntries.push([position, clones])

      if (selector === '') {
        continue
      }

      const elements = f(selector, pageBody)

      for (const element of elements) {
        const clone = element.cloneNode(true) as HTMLElement
        clone.setAttribute('default-pos', position)

        // clone.dataset.className = clone.className
        // clone.removeAttribute('class')
        clone.style.width = 'unset'
        clone.style.float = 'unset'
        clone.style.margin = 'unset'
        clone.style.padding = 'unset'

        container.appendChild(clone)
        clones.push(clone)
      }
    }

    addClass(arrangeMap.contents, container)

    const itemsMap = new Map<string, NodeItem[]>(
      clonesEntries.map(([position, clones]) => [
        position,
        clones.map(clone => ({
          id: getIdOf(clone),
          node: <div dangerouslySetInnerHTML={{ __html: clone.outerHTML }} />,
        }))
      ])
    )

    mount(<PageBody itemsMap={itemsMap} />, container)

    return container
  })
}
