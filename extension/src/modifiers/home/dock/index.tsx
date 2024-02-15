import { addClass, c, f, move, replace } from "@/utils/element"
import { mount } from "@/utils/mount"
import { arrangeMap, selectorMap } from "../config"
import { PageBody } from "./components/page-body"

export default () => {
  replace(selectorMap.pageBody, pageBody => {
    const container = c('div')

    const elements = f(selectorMap.pageElements, pageBody)
    const clones = elements.map(e => e.cloneNode(true) as HTMLElement)
    for (const clone of clones) {
      // clone.dataset.className = clone.className
      // clone.removeAttribute('class')
      clone.style.width = 'unset'
      clone.style.float = 'unset'
      clone.style.margin = 'unset'
      clone.style.padding = 'unset'

      container.appendChild(clone)
    }

    addClass(arrangeMap.contents, container)

    mount(<PageBody elements={clones} />, container)

    return container
  })
}
