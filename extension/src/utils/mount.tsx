import { ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import rootClass from '@/root-class.json'

import { c, ff } from "./element";

/**
 * Mount a React node to the specific container
 * @param content The node to be rendered
 * @param container The container element or a selector for the element
 * @returns The container element
 */
export const mount = (content: ReactNode, container?: Element | string) => {
  if (typeof container === 'undefined') {
    container = c('div', {
      className: rootClass,
    })
  }
  else if (typeof container === 'string') {
    const element = ff(container)
    if (element === null) {
      throw new Error(`The container element was not found: ${container}`)
    }

    container = element
  }

  createRoot(container).render(
    <StrictMode>
      {content}
    </StrictMode>
  );

  return container
}
