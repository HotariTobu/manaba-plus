import { ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import rootClass from '@/root-class.json'

import { c } from "./element";

/**
 * Mount a React node to the specific container
 * @param content The node to be rendered
 * @param container The container element
 * @returns The container element
 */
export const mount = (content: ReactNode, container?: HTMLElement) => {
  if (typeof container === 'undefined') {
    container = c('div', {
      className: rootClass,
    })
  }

  createRoot(container).render(
    <StrictMode>
      {content}
      <Toaster richColors />
    </StrictMode>
  );

  return container
}
