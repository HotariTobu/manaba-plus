import { c } from "@/utils/element"

// Mark if the page is a redirect page.
window.addEventListener('beforeunload', () => {
  const meta = c('meta', {
    name: 'redirect'
  })
  document.head.appendChild(meta)
})
