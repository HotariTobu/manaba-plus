import { popNotifications } from "@/notification";
import { createOnceHook } from "../../../utils/defineOnceHook";
import { toast } from "sonner";

export const useNotifications = createOnceHook(() => {
  popNotifications().then(notifications => {
    for (const notification of notifications) {
      toast(notification)
    }
  })
})
