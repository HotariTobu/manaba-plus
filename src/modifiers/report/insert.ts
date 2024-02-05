import { idMap, selectorMap } from "./config"
import { t } from "@/composables/useT9n"
import { createApp } from 'vue'
import BackupText from './BackupText.vue'
import vuetify from '@/plugins/vuetify'
import { c, ff } from "@/utils/element"

/**
 * Insert a message to prompt DnD files.
 */
const insertDnDMessage = function () {
  const button = ff('#' + idMap.addFileButton)
  if (button === null) {
    return
  }

  const message = c('div', {
    textContent: t.report.dndMessage,
  })
  button.after(message)
}

const insertBackupText = () => {
  const textarea = ff(selectorMap.textarea)
  if (textarea === null) {
    return
  }

  const container = c('div')
  createApp(BackupText).use(vuetify).mount(container)
  textarea.after(container)
}

// Entry point
export default function () {
  insertDnDMessage()
  insertBackupText()
}
