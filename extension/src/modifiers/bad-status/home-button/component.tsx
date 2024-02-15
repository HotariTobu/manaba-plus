import { o } from "@/stores/options"
import { transition, invalidUrl } from "../transition"

import { Button } from "@/components/ui/button"

export const HomeButton = () => {
  return (
    <div className="fixed w-fit h-fit inset-1/2 -translate-x-1/2 -translate-y-1/2">
      <Button disabled={invalidUrl} onClick={transition}>
        {o.timeout.timeoutButtonLabel.value}
      </Button>
    </div>
  )
}