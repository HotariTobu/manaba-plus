import { o } from "@/stores/options"

/**
 * Invoke a function if changing pages is allowed by the user.
 * @param func The function
 */
const modify = (func: () => void) => {
  if (o.common.allowChanging.value) {
    func()
  }
}

export default modify
