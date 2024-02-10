import { o } from "@/stores/options"
import transition, { invalidUrl } from "./transition"

import { Button } from "@/components/ui/button"

export const HomeButton = () => {
  return (
    <Button disabled={invalidUrl} onClick={transition}>
      {o.timeout.timeoutButtonLabel.value}
    </Button>
  )
}
