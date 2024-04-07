import { popNotifications } from "@/notification";
import { defineOnceHook } from "../../../utils/defineOnceHook";
import { toast } from "sonner";

export const useNotifications = defineOnceHook(() => {
  popNotifications().then(notifications => {
    for (const notification of notifications) {
      toast(notification)
    }
  })
})
