import { ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { c } from "./element";

export const mount = (content: ReactNode, container?: Element) => {
  if (typeof container === 'undefined') {
    container = c('div')
  }

  createRoot(container).render(
    <div className="tailwind-container">
      <StrictMode>
        {content}
      </StrictMode>
    </div>
  );

  return container
}
