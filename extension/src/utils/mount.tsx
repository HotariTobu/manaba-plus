import { ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import rootClass from '@/root-class.json'

import { c } from "./element";

export const mount = (content: ReactNode, container?: HTMLElement) => {
  if (typeof container === 'undefined') {
    container = c('div', {
      className: rootClass,
    })
  }

  createRoot(container).render(
    <StrictMode>
      {content}
    </StrictMode>
  );

  return container
}
