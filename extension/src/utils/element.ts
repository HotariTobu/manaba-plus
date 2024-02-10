import { ArrangeMapItem } from "@/types/config"

/**
 * A class to make elements invisible
 */
const hiddenClass = 'hidden'

/**
 * Find an element by a selector string.
 * @param selector The selector string
 * @param root Root node which starts the query
 * @returns The first selected element or null if not found
 */
export const ff = <T extends Element>(selector: string, root: Document | Element = document) => {
  return root.querySelector<T>(selector)
}

/**
 * Find elements by a selector string.
 * @param selector The selector string
 * @param root Root node which starts the query
 * @returns All selected elements or empty NodeList if not found
 */
export const f = <T extends Element>(selector: string, root: Document | Element = document) => {
  return Array.from(root.querySelectorAll<T>(selector))
}

/**
 * Create an element of specified type by tag name.
 * @param tagName The tag name of the element to be created
 * @param properties The specific property values to be attached to the element
 * @returns An element
 */
export const c = <K extends keyof HTMLElementTagNameMap, T = HTMLElementTagNameMap[K]>(
  tagName: K,
  properties?: Pick<T, keyof T>
) => {
  const element = document.createElement(tagName)

  if (typeof properties === 'undefined') {
    return element
  }

  Object.entries(properties).forEach(([key, value]) => {
    (element as Record<string, unknown>)[key] = value
  })

  return element
}

/**
 * Add classes to selected elements.
 * @param item The set object of a selector string and classes to be added
 */
export const addClass = (item: ArrangeMapItem) => {
  const classes = item.className.split(' ')
  f(item.selector).forEach(element => {
    element.classList.add(...classes)
  })
}

/**
 * Hide selected elements.
 * @param selector The selector string
 */
export const hide = (selector: string) => {
  addClass({
    selector,
    className: hiddenClass,
  })
}

/**
 * Replace selected elements with specific created elements.
 * @param selector The selector string
 * @param replacer A function that receives a selected element and returns a new element
 */
export const replace = <T extends Element>(selector: string, replacer: (pastElement: T) => Element | null) => {
  f<T>(selector).forEach(pastElement => {
    const element = replacer(pastElement)
    if (element === null) {
      return
    }

    pastElement.after(element)
    pastElement.classList.add(hiddenClass)
  })
}

/**
 * Replace selected elements with specific created elements and move them to a specific element.
 * @param selector The selector string
 * @param replacer A function that receives a selected element and returns a new element
 * @param destinationSelector The selector of the destination element
 * @param where Insert position
 */
export const move = <T extends Element>(selector: string, replacer: (pastElement: T) => Element | null, destinationSelector: string, where: InsertPosition = 'afterbegin') => {
  const destinationElement = ff(destinationSelector)
  if (destinationElement === null) {
    return
  }

  f<T>(selector).forEach(pastElement => {
    const element = replacer(pastElement.cloneNode() as T)
    if (element === null) {
      return
    }

    destinationElement.insertAdjacentElement(where, element)
    pastElement.classList.add(hiddenClass)
  })
}
