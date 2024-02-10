import { modify } from '@/utils/modify'
import { t } from "@/utils/i18n";
import { o } from '@/stores/options'
import { pushMessages } from '@/stores/messages'
import insert from './insert'
import transition from './transition'

modify(() => {
  insert()
})

if (o.timeout.transitionAutomatically.value) {
  // Wait a while to avoid looping in login sessions.
  const timerId = setTimeout(() => {
    if (o.mainPanel.messages.notifyTimeout.value) {
      pushMessages(t('notification_timeout'))
    }
    transition()
  }, o.timeout.transitionDelayTime.value)

  // Stop transition if the page is a redirect page.
  window.addEventListener('beforeunload', () => {
    clearTimeout(timerId)
  })
}
