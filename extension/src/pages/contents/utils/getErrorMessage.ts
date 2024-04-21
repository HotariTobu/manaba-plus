import { t } from "@/utils/i18n"

export const getErrorMessage = (errorCode: string) => {
  const message = t(`contents_error_message_${errorCode}`)
  if (message.length > 0) {
    return message
  }
  else {
    return errorCode
  }
}
