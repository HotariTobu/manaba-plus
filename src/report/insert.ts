import getOptions from '../options/model'
import { sha256 } from '../utils/hash'
import { compileTemplate } from 'pug'
import { mapFrom } from './backup-text'

/**
 * Insert a message to prompt DnD files.
 */
const insertDnDMessage = function () {
  const button = document.querySelector('.file-upload-button')
  if (button === null) {
    return
  }

  const formMessages = document.createElement('div')
  formMessages.id = 'form-messages'
  button.insertAdjacentElement('afterend', formMessages)
}

/**
 * Restore backup text from the storage.
 */
const restoreText = async function () {
  const textarea = document.querySelector('form textarea')
  if (textarea === null) {
    return
  }

  const { options } = await getOptions()

  const backupTextMap = mapFrom(options.assignments['backup-text'].value)
  const hash = await sha256(location.href)

  const text = backupTextMap.get(hash)
  if (typeof text === 'undefined') {
    return
  }

  const module: compileTemplate = require('./backup.pug')
  textarea.insertAdjacentHTML('afterend', module({ text }))
}

// Entry point
export default async function () {
  insertDnDMessage()
  await restoreText()
}
