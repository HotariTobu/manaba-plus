import detectLongPress from "@/utils/detectLongPress"
import { f } from "@/utils/element"
import { arrangeMap, classMap, selectorMap } from "./config"

const addEditEvent = () => {
  const editStartEvent = new CustomEvent('editStart', {
    bubbles: false,
    cancelable: true,
  })
  const editEndEvent = new CustomEvent('editEnd', {
    bubbles: false,
    cancelable: true,
  })

  let editing = false

  detectLongPress(document, () => {
    let accepted = false

    if (editing) {
      accepted = document.dispatchEvent(editEndEvent)
    }
    else {
      accepted = document.dispatchEvent(editStartEvent)
    }

    if (accepted) {
      editing = !editing
    }
  })
}

const addDockEvent = () => {
  const draggableList = f<HTMLElement>(arrangeMap.dock.draggable.selector)
  const droppableList = f<HTMLElement>(selectorMap.droppable)

  let dragging = false

  document.addEventListener('editStart', () => {
    for (const draggable of draggableList) {
      draggable.setAttribute('draggable', 'true')
    }
  })

  document.addEventListener('editEnd', event => {
    if (dragging) {
      event.preventDefault()
      return
    }

    for (const draggable of draggableList) {
      draggable.removeAttribute('draggable')
    }
  })

  const prefix = 'dock#'

  for (const draggable of draggableList) {
    const id = draggable.id
    if (id === '') {
      continue
    }

    draggable.addEventListener('dragstart', event => {
      const transfer = event.dataTransfer
      if (transfer === null) {
        return
      }

      if (!document.body.classList.contains(classMap.editing)) {
        return
      }

      // event.preventDefault()
      event.stopPropagation()

      transfer.setData('text/plain', prefix + id)
      transfer.dropEffect = 'move'

      dragging = true

      console.log('drag start', id)
    })

    draggable.addEventListener('dragend', event => {
      dragging = false
    })
  }

  for (const droppable of droppableList) {
    droppable.addEventListener('dragover', event => {
      event.preventDefault()
      console.log('dragover')
      if (event.dataTransfer !== null) {
        event.dataTransfer.dropEffect = 'move'
      }
    })

    droppable.addEventListener('drop', event => {
      const data = event.dataTransfer?.getData('text/plain')

      if (typeof data === 'undefined' || !data.startsWith(prefix)) {
        return
      }

      event.preventDefault()

      const id = data.substring(prefix.length)
      console.log('drop', id)
    })
  }
}

export default () => {
  addEditEvent()
  addDockEvent()
}
