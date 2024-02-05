import { c, replace } from "@/utils/element"
import { selectorMap } from "./config"
import { createApp } from 'vue'
import vuetify from '@/plugins/vuetify'
import Z from './Z.vue'

const replacePageContent = () => {
  const container = c('div')
  createApp(Z).use(vuetify).mount(container)
  return container
}

// Entry point
export default () => {
  replace(selectorMap.pageContent, replacePageContent)
}
