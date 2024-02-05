import './style.scss'
import modify from '@/utils/modify'
import insert from './insert'
import { o } from '@/stores/options'
import { pushMessages } from '@/stores/messages'
import transition from './transition'
import { t } from '@/composables/useT9n'

modify(() => {
  insert()
})

if (o.timeout.transitionAutomatically.value) {
  // Wait a while to avoid looping in login sessions.
  const timerId = setTimeout(() => {
    if (o.mainPanel.messages.notifyTimeout.value) {
      pushMessages(t.logMessages.timeout)
    }
    transition()
  }, o.timeout.transitionDelayTime.value)

  // Stop transition if the page is a redirect page.
  window.addEventListener('beforeunload', () => {
    clearTimeout(timerId)
  })
}
