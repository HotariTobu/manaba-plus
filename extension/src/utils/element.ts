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
 * Hide selected elements.
 * @param selector The selector string
 * @param root Root node which starts the query
 */
export const hide = (selector: string, root: Document | Element = document) => {
  addClass({
    selector,
    className: hiddenClass,
  }, root)
}

/**
 * Replace selected elements with specific created elements.
 * @param target The selector string to select target elements, or the target element(s)
 * @param replacer A function that receives a selected element and returns a new element, or the the new element
 * @param root Root node which starts the query
 */
export const replace = <T extends Element>(target: string | T | T[], replacer: ((pastElement: T) => Element | null) | Element, root: Document | Element = document) => {
  if (typeof target === 'string') {
    target = f<T>(target, root)
  }
  else if (!Array.isArray(target)) {
    target = [target]
  }

  target.forEach(pastElement => {
    let element: Element | null
    if (replacer instanceof Element) {
      element = replacer
    }
    else {
      element = replacer(pastElement)
    }

    if (element === null) {
      return
    }

    pastElement.after(element)
    pastElement.classList.add(hiddenClass)
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
export const move = <T extends Element>(target: string | T | T[], replacer: ((pastElement: T) => Element | null) | Element, destination: string | Element, where: InsertPosition = 'afterbegin', root: Document | Element = document) => {
  if (typeof destination === 'string') {
    const element = ff(destination, root)
    if (element === null) {
      return
    }
    destination = element
  }

  if (typeof target === 'string') {
    target = f<T>(target, root)
  }
  else if (!Array.isArray(target)) {
    target = [target]
  }

  const dest = destination

  target.forEach(pastElement => {
    let element: Element | null
    if (replacer instanceof Element) {
      element = replacer
    }
    else {
      element = replacer(pastElement.cloneNode(true) as T)
    }

    if (element === null) {
      return
    }

    dest.insertAdjacentElement(where, element)
    pastElement.classList.add(hiddenClass)
  })
}
