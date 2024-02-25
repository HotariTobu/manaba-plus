import { o } from "@/stores/options"
import { transition, invalidUrl } from "../transition"

import { Button } from "@/components/ui/button"

export const HomeButton = () => {
  return (
    <div className="fixed w-fit h-fit inset-1/2 -translate-x-1/2 -translate-y-1/2">
      <Button asChild disabled={invalidUrl} onClick={transition}>
        <div>
          {o.timeout.timeoutButtonLabel.value}
        </div>
      </Button>
    </div>
  )
}
