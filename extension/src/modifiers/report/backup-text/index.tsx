import { ff } from "@/utils/element"
import { mount } from "@/utils/mount"
import { selectorMap } from "../config"
import { getBackupText, setBackupText } from './storage'
import { BackupText } from './component'

const insertBackupText = () => {
  const textarea = ff(selectorMap.textarea)
  if (textarea === null) {
    return
  }

  const backupText = getBackupText()
  if (backupText === null) {
    return
  }

  const container = mount(<BackupText backupText={backupText} />)
  textarea.after(container)
}


/**
 * Add an event to backup text to the storage.
 */
const addBackupEvent = function () {
  const textarea = ff<HTMLTextAreaElement>(selectorMap.textarea)
  if (textarea === null) {
    return
  }

  textarea.addEventListener('input', () => {
    const text = textarea.value
    setBackupText(text)
  })
}

// Entry point
export default () => {
  insertBackupText()
  addBackupEvent()
}
