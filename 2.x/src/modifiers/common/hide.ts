import { o } from '@/stores/options'
import { hide } from '@/utils/element'
import { selectorMap } from './config'

// Entry point
export default function () {
  if (!o.common.showNotes.value) {
    // Hide notes in the document.
    hide(selectorMap.notes)
  }
}
