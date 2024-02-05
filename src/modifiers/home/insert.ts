import { c, ff } from "@/utils/element"
import { arrangeMap, idMap } from "./config"

const insertRightPanel = () => {
  const container = ff(arrangeMap.dock.pageBody.selector)
  if (container === null) {
    return
  }

  const rightPanel = c('div', {
    id: idMap.rightPanel,
    className: arrangeMap.dock.rightPanel.className,
  })
  container.appendChild(rightPanel)
}

// Entry point
export default () => {
  insertRightPanel()
}
