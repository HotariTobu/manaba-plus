import { addClass, c, f, move } from "@/utils/element"
import { arrangeMap, classMap, getDraggableId, selectorMap } from "./config"

/**
 * Move the self-registration link element from the inside of the former link element to the outside.
 */
const extractSelfRegistrationLink = () => {
  move(selectorMap.selfRegistration, (pastElement) => {
    const header = c('div', {
      className: classMap.selfRegistration.header,
    })

    const body = c('div', {
      className: classMap.selfRegistration.body,
    })
    body.appendChild(pastElement)

    const element = c('div', {
      className: classMap.selfRegistration.container,
    })
    element.appendChild(header)
    element.appendChild(body)

    return element
  }, selectorMap.formerLink, 'afterend')
}

/**
 * Apply a flex layout to the banner list on the right side.
 */
const arrangeBannerList = () => {
  addClass(arrangeMap.arrange.bannerList)
}

/**
 * Give draggable elements ids.
 */
const arrangeDraggable = () => {
  const draggableList = f<HTMLElement>(arrangeMap.dock.draggable.selector)
  for (const draggable of draggableList) {
    const id = getDraggableId(draggable)
    if (id === null) {
      continue
    }

    draggable.id = id
  }
}

/**
 * Apply a grid layout to the page contents.
 */
const arrangeDroppable = () => {
  addClass(arrangeMap.dock.pageBody)
  addClass(arrangeMap.dock.pageHeader)
  addClass(arrangeMap.dock.leftPanel)
}

// Entry point
export default () => {
  extractSelfRegistrationLink()
  arrangeBannerList()
  arrangeDraggable()
  arrangeDroppable()
}
