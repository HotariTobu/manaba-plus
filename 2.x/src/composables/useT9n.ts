import ja from '@/locales/ja.json'

// A message when the specified locale is not acceptable
const fallbackMessage = ja

const messages: {
  [key: string]: typeof fallbackMessage
} = {
  ja,
}

/**
 * The current locale
 */
export const locale = document.documentElement.lang

let message = messages[locale]
if (typeof message === 'undefined') {
  message = fallbackMessage
}

// The message in the current locale
export const t = message
