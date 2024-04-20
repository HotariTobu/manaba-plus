import { ArrangeMap, ArrangeMapItem } from "@/types/config"

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
 * @param item The set object of a selector string and classes to be added, or a set of the sets
 * @param root Root node which starts the query
 */
export const addClass = (item: ArrangeMapItem | ArrangeMap, root: Document | Element = document) => {
  if (typeof item.selector === 'string' && typeof item.className === 'string') {
    const classes = item.className.split(' ')
    f(item.selector, root).forEach(element => {
      element.classList.add(...classes)
    })
  }
  else {
    for (const subItem of Object.values(item)) {
      addClass(subItem, root)
    }
  }
}

/**
 * Get target elements determined by various types.
 * @param target The selector string to select target elements, or the target element(s)
 * @param root Root node which starts the query
 * @returns An array of target elements
 */
const getTargetElements = <T extends Element>(target: string | T | T[], root: Document | Element = document) => {
  if (typeof target === 'string') {
    return f<T>(target, root)
  }
  else if (!Array.isArray(target)) {
    return [target]
  }

  return target
}

/**
 * Hide elements.
 * @param target The selector string to select target elements, or the target element(s)
 * @param root Root node which starts the query
 */
export const hide = <T extends Element>(target: string | T | T[], root: Document | Element = document) => {
  getTargetElements(target, root).forEach(element => {
    element.classList.add(hiddenClass)
  })
}

/**
 * Show hidden elements.
 * @param target The selector string to select target elements, or the target element(s)
 * @param root Root node which starts the query
 */
export const unhide = <T extends Element>(target: string | T | T[], root: Document | Element = document) => {
  getTargetElements(target, root).forEach(element => {
    element.classList.remove(hiddenClass)
  })
}

/**
 * Replace selected elements with specific created elements.
 * @param target The selector string to select target elements, or the target element(s)
 * @param replacer A function that receives a selected element and returns a new element, or the the new element
 * @param root Root node which starts the query
 */
export const replace = <T extends Element>(target: string | T | T[], replacer: ((pastElement: T, unhide: () => void) => Element | null) | Element, root: Document | Element = document) => {
  getTargetElements(target, root).forEach(pastElement => {
    let element: Element | null
    if (replacer instanceof Element) {
      element = replacer
    }
    else {
      element = replacer(pastElement, () => unhide(pastElement))
    }

    if (element === null) {
      return
    }

    pastElement.before(element)
    hide(pastElement)
  })
}

/**
 * Replace selected elements with specific created elements and move them to a specific element.
 * @param target The selector string to select target elements, or the target element(s)
 * @param replacer A function that receives a selected element and returns a new element, or the the new element
 * @param destinationSelector The selector of the destination element
 * @param where Insert position
 * @param root Root node which starts the query
 */
export const move = <T extends Element>(target: string | T | T[], replacer: ((pastElement: T, unhide: () => void) => Element | null) | Element, destination: string | Element, where: InsertPosition = 'afterbegin', root: Document | Element = document) => {
  if (typeof destination === 'string') {
    const element = ff(destination, root)
    if (element === null) {
      return
    }
    destination = element
  }

  const dest = destination

  getTargetElements(target, root).forEach(pastElement => {
    let element: Element | null
    if (replacer instanceof Element) {
      element = replacer
    }
    else {
      element = replacer(pastElement.cloneNode(true) as T, () => unhide(pastElement))
    }

    if (element === null) {
      return
    }

    dest.insertAdjacentElement(where, element)
    pastElement.classList.add(hiddenClass)
  })
}
