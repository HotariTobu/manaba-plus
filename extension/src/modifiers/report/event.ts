import { sha256 } from '@/utils/hash'
import { mapFrom, toArray } from './backup-text'
import { o } from '@/stores/options'
import { classMap, selectorMap } from './config'
import { submitAll } from './submit'
import { ff } from '@/utils/element'

/**
 * Add events to accept file dnd.
 */
const addDnDEvents = () => {
  const form = ff<HTMLFormElement>(selectorMap.form)
  if (form === null) {
    return
  }

  form.addEventListener('dragenter', function (event) {
    event.preventDefault()
    form.classList.add(classMap.formDnD)
  })
  form.addEventListener('dragleave', function (event) {
    event.preventDefault()
    form.classList.remove(classMap.formDnD)
  })
  form.addEventListener('dragover', function (event) {
    event.preventDefault()
  })
  form.addEventListener('drop', async function (event) {
    event.preventDefault()
    const files = event.dataTransfer?.files
    if (files instanceof FileList) {
      submitAll(files)
    }
  })
}

/**
 * Add an event to backup text to the storage.
 */
const addBackupEvent = async function () {
  const textarea = ff<HTMLTextAreaElement>(selectorMap.textarea)
  if (textarea === null) {
    return
  }

  const backupTextMap = mapFrom(o.assignments.backupText.value)
  const hash = await sha256(location.href)

  textarea.addEventListener('input', function () {
    const text = textarea.value
    backupTextMap.set(hash, text)
    o.assignments.backupText.value = toArray(backupTextMap) as never[]
  })
}

// Entry point
export default async function () {
  addDnDEvents()
  await addBackupEvent()
}
