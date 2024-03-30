import { modify } from '@/utils/modify'
import { t } from "@/utils/i18n";
import { o } from '@/stores/options'
import { transition } from './transition'
import homeButton from './home-button';
import { pushNotification } from '@/store';
import { ff } from '@/utils/element';

// Make actions if the page is not a redirect page.
if (ff('meta[name="redirect"]') === null) {
  modify(() => {
    homeButton()
  })

  if (o.timeout.transitionAutomatically.value) {
    // Wait a while to avoid looping in login sessions.
    const timerId = setTimeout(() => {
      if (o.mainPanel.messages.notifyTimeout.value) {
        pushNotification(t('notification_timeout'))
      }
      transition()
    }, o.timeout.transitionDelayTime.value)

    // Stop the timer when a transition starts.
    window.addEventListener('beforeunload', () => {
      clearTimeout(timerId)
    })
  }
}
