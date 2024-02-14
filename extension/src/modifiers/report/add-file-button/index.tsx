import { mount } from "@/utils/mount"
import { replace, ff, c } from "@/utils/element"
import { selectorMap } from "../config"
import { AddFileButtonPanel } from "./component"
import { submitAll } from './submit'

/**
 * Classes applied when dragging files
 */
const dndFormStyle = ['bg-slate-200', 'animate-pulse']

/**
 * Invoke a callback if the event is fired by a file system.
 * @param event Event object of drag
 * @param callback The callback function
 */
const fromFileSystem = (event: DragEvent, callback: () => void) => {
  const types = event.dataTransfer?.types?.join(',') ?? ''
  if (/file/i.test(types)) {
    event.preventDefault()
    callback()
  }
}

/**
 * Add events to accept file dnd.
 */
const addDnDEvents = () => {
  const form = ff<HTMLFormElement>(selectorMap.form)
  if (form === null) {
    return
  }

  var innerFlag = false;

  form.addEventListener('dragenter', (event) => {
    fromFileSystem(event, () => {
      innerFlag = true
    })
  })
  form.addEventListener('dragleave', (event) => {
    fromFileSystem(event, () => {
      if (innerFlag) {
        innerFlag = false;
      } else {
        form.classList.remove(...dndFormStyle)
      }
    })
  })
  form.addEventListener('dragover', (event) => {
    fromFileSystem(event, () => {
      if (innerFlag) {
        innerFlag = false
        form.classList.add(...dndFormStyle)
      }
    })
  })
  form.addEventListener('drop', async (event) => {
    fromFileSystem(event, () => {
      const files = event.dataTransfer?.files
      if (files instanceof FileList) {
        submitAll(files)
      }
    })
  })
}

// Entry point
export default () => {
  const addFileButton = ff(selectorMap.addFileButton)
  if (addFileButton === null) {
    return
  }

  // Replace add-file-button to enable users to select multiple files.
  const container = mount(<AddFileButtonPanel />)
  replace(addFileButton, container)

  addDnDEvents()
}
