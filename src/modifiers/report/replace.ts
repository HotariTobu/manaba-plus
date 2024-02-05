import { c, replace } from "@/utils/element"
import { idMap, selectorMap } from "./config"
import { createApp } from 'vue'
import AddFileButton from './AddFileButton.vue'
import vuetify from '@/plugins/vuetify'

const replaceAddFileButton = () => {
  const container = c('div', {
    id: idMap.addFileButton,
  })
  createApp(AddFileButton).use(vuetify).mount(container)
  return container
}

// Entry point
export default function () {
  replace(selectorMap.addFileButton, replaceAddFileButton)
}
